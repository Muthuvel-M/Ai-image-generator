"""
D-ID Video Generation Module
Generates talking head videos using D-ID AI Avatar API
"""

import httpx
import asyncio
import logging
from typing import Optional
import os

logger = logging.getLogger(__name__)

class DIDVideoGenerator:
    """Generate videos using D-ID API"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.d-id.com"
        self.headers = {
            "Authorization": f"Basic {api_key}",
            "Content-Type": "application/json"
        }
    
    async def create_talk(self, script: str, source_url: str) -> dict:
        """
        Create a talking video
        
        Args:
            script: Text to be spoken
            source_url: URL of the avatar image or video
            
        Returns:
            dict with talk_id and status
        """
        url = f"{self.base_url}/talks"
        
        payload = {
            "script": {
                "type": "text",
                "input": script,
                "provider": {
                    "type": "microsoft",
                    "voice_id": "en-US-JennyNeural"  # Natural female voice
                }
            },
            "source_url": source_url,
            "config": {
                "fluent": True,
                "pad_audio": 0.0
            }
        }
        
        # D-ID expects "Authorization: Basic <key>" format
        headers = {
            "Authorization": f"Basic {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                logger.info(f"Calling D-ID API to create talk...")
                response = await client.post(url, headers=headers, json=payload)
                
                # Log response for debugging
                logger.info(f"D-ID API Response Status: {response.status_code}")
                logger.info(f"D-ID API Response: {response.text[:200]}")
                
                response.raise_for_status()
                data = response.json()
                
                logger.info(f"Created talk: {data.get('id')}")
                return {
                    "talk_id": data.get("id"),
                    "status": data.get("status"),
                    "created_at": data.get("created_at")
                }
            except httpx.HTTPStatusError as e:
                logger.error(f"D-ID API HTTP Error: {e.response.status_code} - {e.response.text}")
                raise Exception(f"D-ID API error: {e.response.text}")
            except Exception as e:
                logger.error(f"Failed to create talk: {e}")
                raise
    
    async def get_talk_status(self, talk_id: str) -> dict:
        """
        Check the status of a video generation
        
        Args:
            talk_id: The ID of the talk
            
        Returns:
            dict with status and result_url if completed
        """
        url = f"{self.base_url}/talks/{talk_id}"
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                data = response.json()
                
                return {
                    "status": data.get("status"),
                    "result_url": data.get("result_url"),
                    "created_at": data.get("created_at"),
                    "started_at": data.get("started_at"),
                    "duration": data.get("duration")
                }
            except httpx.HTTPError as e:
                logger.error(f"Failed to get talk status: {e}")
                raise
    
    async def wait_for_completion(self, talk_id: str, max_wait: int = 120) -> Optional[str]:
        """
        Poll until video is ready
        
        Args:
            talk_id: The ID of the talk
            max_wait: Maximum seconds to wait
            
        Returns:
            URL of the completed video, or None if timeout
        """
        elapsed = 0
        interval = 3  # Check every 3 seconds
        
        while elapsed < max_wait:
            status_data = await self.get_talk_status(talk_id)
            status = status_data.get("status")
            
            if status == "done":
                logger.info(f"Video ready: {talk_id}")
                return status_data.get("result_url")
            elif status == "error":
                logger.error(f"Video generation failed: {talk_id}")
                return None
            
            # Still processing
            await asyncio.sleep(interval)
            elapsed += interval
            logger.info(f"Waiting for video... ({elapsed}s)")
        
        logger.warning(f"Video generation timeout: {talk_id}")
        return None
    
    async def generate_video(self, script: str, avatar_url: str) -> Optional[str]:
        """
        Complete pipeline: create talk and wait for result
        
        Args:
            script: Text to be spoken
            avatar_url: URL of avatar image
            
        Returns:
            URL of completed video, or None if failed
        """
        # Create the talk
        talk_data = await self.create_talk(script, avatar_url)
        talk_id = talk_data.get("talk_id")
        
        if not talk_id:
            return None
        
        # Wait for completion
        video_url = await self.wait_for_completion(talk_id)
        return video_url


# Default avatar URLs (free stock images)
DEFAULT_AVATARS = {
    "professional_woman": "https://create-images-results.d-id.com/auth0|6766a9ff45a18c88ace3e5f6/upl_J2uo0F0QpN6F5ZUZ3DZHZ/image.jpeg",
    "professional_man": "https://create-images-results.d-id.com/auth0|6766a9ff45a18c88ace3e5f6/upl_w73fIb9JX0BPDtPtOIjfw/image.jpeg",
    "casual_woman": "https://create-images-results.d-id.com/auth0|6766a9ff45a18c88ace3e5f6/upl_SHyE7p-4bBz2R_VxR_Cwa/image.jpeg",
}

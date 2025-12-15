"""
Local Video Generator using MoviePy + TTS
Generates videos from static images with voice narration
"""

from moviepy.editor import ImageClip, AudioFileClip, CompositeAudioClip
import os
import logging
import uuid

logger = logging.getLogger(__name__)

class LocalVideoGenerator:
    """Generate videos locally using MoviePy"""
    
    def __init__(self):
        # Lazy load TTS to avoid import errors at server startup
        self.tts = None
        self.default_avatar = "assets/avatars/professional_woman.jpg"
    
    def _ensure_tts(self):
        """Initialize TTS only when needed"""
        if self.tts is None:
            logger.info("Initializing TTS model (first time)...")
            from TTS.api import TTS
            # Using VITS model for better prosody and natural intonation
            # VITS has more emotional expression than Tacotron2
            self.tts = TTS("tts_models/en/ljspeech/vits")
            logger.info("TTS model ready! (VITS - Natural prosody)")
    
    def generate_voice(self, text: str, output_path: str) -> str:
        """
        Generate voice audio from text
        
        Args:
            text: Text to convert to speech
            output_path: Where to save the audio file
            
        Returns:
            Path to generated audio file
        """
        self._ensure_tts()  # Initialize TTS if not already done
        logger.info(f"Generating voice for text: {text[:50]}...")
        self.tts.tts_to_file(text=text, file_path=output_path)
        logger.info(f"Voice generated: {output_path}")
        return output_path
    
    def create_video(self, script: str, avatar_image: str, output_path: str) -> str:
        """
        Create video from static image and voice
        
        Args:
            script: Text to be spoken
            avatar_image: Path to avatar image
            output_path: Where to save the video
            
        Returns:
            Path to generated video
        """
        try:
            # Step 1: Generate voice
            audio_path = f"temp/audio_{uuid.uuid4()}.wav"
            os.makedirs("temp", exist_ok=True)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            self.generate_voice(script, audio_path)
            
            # Step 2: Load audio to get duration
            logger.info("Creating video...")
            audio = AudioFileClip(audio_path)
            duration = audio.duration
            
            # Step 3: Create video from static image
            video = ImageClip(avatar_image).set_duration(duration)
            
            # Step 4: Add audio to video
            final_video = video.set_audio(audio)
            
            # Step 5: Write video file
            logger.info(f"Writing video to {output_path}...")
            final_video.write_videofile(
                output_path,
                fps=24,
                codec='libx264',
                audio_codec='aac',
                temp_audiofile='temp/temp-audio.m4a',
                remove_temp=True,
                logger=None  # Suppress moviepy output
            )
            
            # Cleanup
            audio.close()
            video.close()
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
            logger.info(f"Video generated successfully: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Video generation failed: {e}")
            raise

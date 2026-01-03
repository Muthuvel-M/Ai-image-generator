/**
 * Avatar-based Video Prompt Generator
 * Creates enhanced prompts for Google Veo 3 with avatar context
 */

/**
 * Generate an avatar-based video prompt
 * @param {string} content - The main content to be explained
 * @param {object} options - Configuration options
 * @returns {string} Enhanced prompt for video generation
 */
export function createAvatarPrompt(content, options = {}) {
    const {
        avatar = 'man', // man, woman, professional, teacher
        action = 'sits at a desk and reads aloud',
        style = 'clear, educational manner with gestures and expressions',
        maxLength = 500
    } = options;

    // Truncate content if too long
    const truncatedContent = content.substring(0, maxLength);
    const isTruncated = content.length > maxLength;

    // Build the prompt
    const prompt = `A ${avatar} ${action} the following information: "${truncatedContent}${isTruncated ? '...' : ''}". The ${avatar} is explaining this content in a ${style}.`;

    return prompt;
}

/**
 * Predefined avatar configurations
 */
export const avatarPresets = {
    // Educational presenter
    educator: {
        avatar: 'professional man in business casual attire',
        action: 'sits at a modern desk and presents',
        style: 'clear, engaging manner with natural hand gestures and friendly expressions'
    },

    // Teacher style
    teacher: {
        avatar: 'friendly teacher',
        action: 'stands in front of a whiteboard and explains',
        style: 'warm, approachable teaching style with helpful gestures'
    },

    // News anchor style
    newsAnchor: {
        avatar: 'professional news anchor',
        action: 'sits at a news desk and delivers',
        style: 'professional, authoritative manner with confident expressions'
    },

    // Casual presenter
    casual: {
        avatar: 'casual person',
        action: 'sits comfortably and discusses',
        style: 'relaxed, conversational manner with natural movements'
    },

    // Tech presenter
    tech: {
        avatar: 'tech expert',
        action: 'sits in a modern tech environment and explains',
        style: 'knowledgeable, enthusiastic manner with dynamic gestures'
    },

    // Simple sitting and reading (default)
    simple: {
        avatar: 'man',
        action: 'sits and reads',
        style: 'clear, calm manner'
    }
};

/**
 * Create video prompt with preset configuration
 * @param {string} content - The content to be explained
 * @param {string} presetName - Name of the preset (educator, teacher, newsAnchor, casual, tech, simple)
 * @param {number} maxLength - Maximum content length (default: 500)
 * @returns {string} Enhanced prompt
 */
export function createAvatarPromptWithPreset(content, presetName = 'educator', maxLength = 500) {
    const preset = avatarPresets[presetName] || avatarPresets.educator;
    return createAvatarPrompt(content, { ...preset, maxLength });
}

/**
 * Examples of avatar prompts
 */
export const avatarPromptExamples = {
    educator: (content) => createAvatarPromptWithPreset(content, 'educator'),
    teacher: (content) => createAvatarPromptWithPreset(content, 'teacher'),
    newsAnchor: (content) => createAvatarPromptWithPreset(content, 'newsAnchor'),
    casual: (content) => createAvatarPromptWithPreset(content, 'casual'),
    tech: (content) => createAvatarPromptWithPreset(content, 'tech'),
    simple: (content) => createAvatarPromptWithPreset(content, 'simple')
};

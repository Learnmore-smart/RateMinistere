export const reportForModeration = async (
    session,
    content,
    type,
    contextName,
    schoolId = '',
    commentId = '',
    reason = ''
) => {
    try {
        const response = await fetch('https://discord.com/api/webhooks/1350658584085790791/LteMegecBpb5I_LLhiPF0QLEctAYFA6t_LlC6vUNz2wD8v7sOlgg5Igd4cnyQJZeeF_s', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: [
                    '🚨 **CONTENT NEEDS MODERATION** 🚨',
                    '',
                    '**Reporter Information**',
                    `• Name: ${session?.data?.user?.name}`,
                    `• Email: ${session?.data?.user?.email}`,
                    `• Content Type: ${type}`,
                    `• Comment ID: ${commentId}`,
                    schoolId ? `• School ID: ${schoolId}` : '',
                    `• Context: ${contextName}`,
                    '',
                    '**Report Reason**',
                    reason,
                    '',
                    '**Reported Content**',
                    '```',
                    content,
                    '```',
                    '',
                    '⚠️ _This content has been flagged for review and needs to be moderated._'
                ].filter(Boolean).join('\n')
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Error reporting content:', error);
        return false;
    }
};
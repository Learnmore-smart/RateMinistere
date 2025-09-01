// constants.js
import Image from 'next/image';  // Corrected: No curly braces

export const COURSE_OPTIONS = [
    {
        name: 'Math',
        icon: (
            <Image
                src="https://d35aaqx5ub95lt.cloudfront.net/vendor/395c8a6ee9783610b578b02fda405e85.svg"
                alt="Math Icon"
                width={32.5}
                height={25}
                style={{
                    filter: 'saturate(180%)',
                }}
            />
        ),
        key: 'math',
    },
    {
        name: 'English',
        icon: (
            <Image
                src="https://d35aaqx5ub95lt.cloudfront.net/vendor/bbe17e16aa4a106032d8e3521eaed13e.svg"
                alt="English Icon"
                width={32.5}
                height={25}
                style={{
                    filter: 'saturate(180%)',
                }}
            />
        ),
        key: 'en',
    },
    {
        name: 'French',
        icon: (
            <Image
                src="https://d35aaqx5ub95lt.cloudfront.net/vendor/482fda142ee4abd728ebf4ccce5d3307.svg"
                alt="French Icon"
                width={32.5}
                height={25}
                style={{
                    filter: 'saturate(180%)',
                }}
            />
        ),
        key: 'fr',
    }
];

export const DAILY_QUESTS = [
    { id: '0', type: 'battles_completed', description: 'Complete 3 battles today', goal: 3, difficulty: 1, progress: 2 },
    { id: '1', type: 'xp_earned', description: 'Earn 150 XP today', goal: 150, difficulty: 1, progress: 80 },
    { id: '2', type: 'battles_won', description: 'Win 2 battles today', goal: 2, difficulty: 2, progress: 1 }
];

export const DAILY_REWARDS = [
    { type: 'gems', amount: 5, description: '5 Gems' },
    { type: 'gems', amount: 10, description: '10 Gems' },
    { type: 'special_bullet', amount: 1, description: 'Electric Bolt' },
    { type: 'gems', amount: 20, description: '15 Gems' },
    { type: 'special_bullet', amount: 1, description: 'Ice Shard' },
    { type: 'gems', amount: 35, description: '35 Gems' },
    { type: 'chest', amount: 1, description: 'Gold Chest' },
];
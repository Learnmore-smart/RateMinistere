/**
 * @typedef {Object} Badge
 * @property {number} id - Unique identifier for the badge
 * @property {string} name - Display name of the badge
 * @property {string} src - Path to the badge image
 * @property {string} description - Description of how the badge was earned
 */

import dbConnect from "../lib/dbConnect";
import user from "../models/user";

/** @type {Badge[]} */
export const badges = [
  { id: 0, name: 'No badge', src: '/images/Badges/no-badge.png', description: 'Do not display a badge' },
  { id: 1, name: 'Early Bird', src: '/images/Badges/Beta-Christmas.png', description: 'Joined during beta' },
];

/**
 * Finds a badge by its name
 * @param {string} badgename - The name of the badge to find
 * @returns {Badge|undefined} The found badge or undefined if not found
 */
export function getBadge(badgename) {
  return badges.find(badge => badge.name === badgename);
}

/**
 * Finds a badge by its id
 * @param {number} badgeid - The id of the badge to find
 * @returns {Badge|undefined} The found badge or undefined if not found
 */
export function getBadgeById(badgeid) {
  return badges.find(badge => badge.id === badgeid);
}

/**
 * Finds an array of badges by an array of their ids
 * @param {Badge[]} badgeIds - Array of ids of the badges to find
 * @returns {Badge[]|[]} The found badges or undefined if none found
 */
export function getBadgesById(badgeIds) {
  return badges.filter(badge => badgeIds.includes(badge.id));
}

//Add badges to user's collection
//Add badges to user's collection
export async function addBadge(body) {
  return new Promise(async (resolve, reject) => {
    try {
      // Connect to MongoDB
      await dbConnect();

      // Extract data from the request body
      const {
        badgeId,
        NoahPass,
        email
      } = body;

      if (!badgeId || !NoahPass || NoahPass !== process.env.NotAPassword) {
        return resolve({ error: "No badgeId or pass" });
      }

      // Find the user and update owned badges
      const updatedUser = await user.findOneAndUpdate(
        { email },
        {
          $addToSet: { 'badges.owned': badgeId },
        },
        { new: true, upsert: true }
      );

      if (!updatedUser) {
        return resolve({ error: "User not found" });
      }

      // Return updated user data
      resolve({ ok: true });
    } catch (error) {
      console.error("Error adding badge:", error);
      reject({ error: error.message });
    }
  });
}
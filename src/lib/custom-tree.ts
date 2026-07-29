import type { Node } from 'fumadocs-core/page-tree';
import { sectionIcons } from '@/lib/gitbook-icons';

export const customTree: Node[] = [
  {
    type: 'page',
    name: 'General Overview',
    url: '/',
    icon: sectionIcons.overview,
  },
  {
    type: 'folder',
    name: 'Installation & Setup',
    icon: sectionIcons.installation,
    index: {
      type: 'page',
      name: 'Installation & Setup',
      url: '/installation-and-setup',
    },
    children: [
      { type: 'page', name: 'Installation', url: '/installation-and-setup/installation' },
      { type: 'page', name: 'Setup', url: '/installation-and-setup/setup' },
      { type: 'page', name: 'Back Up Your Profile', url: '/installation-and-setup/back-up-your-profile' },
      { type: 'page', name: 'App Permissions', url: '/installation-and-setup/app-permissions' },
      { type: 'page', name: 'Link Devices', url: '/installation-and-setup/link-devices' },
      { type: 'page', name: 'Keet Username', url: '/installation-and-setup/keet-username' },
    ],
  },
  {
    type: 'folder',
    name: 'Keet Groups',
    icon: sectionIcons.groups,
    index: { type: 'page', name: 'Keet Groups', url: '/keet-groups' },
    children: [
      { type: 'page', name: 'Joining Groups 🛋️', url: '/keet-groups/joining-groups' },
      { type: 'page', name: 'Create a Group 📲', url: '/keet-groups/create-a-group' },
      { type: 'page', name: 'Invite Peers 🙋', url: '/keet-groups/invite-peers' },
      { type: 'page', name: 'Group Member Roles 🥷', url: '/keet-groups/group-member-roles' },
      { type: 'page', name: 'Group Moderation ⚖️', url: '/keet-groups/group-moderation' },
      { type: 'page', name: 'Admin Responsibilities 👑', url: '/keet-groups/admin-responsibilities' },
      { type: 'page', name: 'Leave Group🚪', url: '/keet-groups/leave-group' },
      { type: 'page', name: 'Groups to Join 🧩', url: '/keet-groups/groups-to-join' },
    ],
  },
  {
    type: 'folder',
    name: 'File Sharing and Messages',
    icon: sectionIcons.files,
    index: {
      type: 'page',
      name: 'File Sharing and Messages',
      url: '/file-sharing-and-messages',
    },
    children: [
      { type: 'page', name: 'Messaging on Keet ✉️', url: '/file-sharing-and-messages/messaging-on-keet' },
      { type: 'page', name: 'Personal Group 📂', url: '/file-sharing-and-messages/personal-group' },
      { type: 'page', name: 'Contact Book 📓', url: '/file-sharing-and-messages/contact-book' },
      { type: 'page', name: 'Snooze Notifications 🔕', url: '/file-sharing-and-messages/snooze-notifications' },
      {
        type: 'page',
        name: 'Sharing Files and Media 🗃️',
        url: '/file-sharing-and-messages/sharing-files-and-media',
      },
      { type: 'page', name: 'Search Messages 🔎', url: '/file-sharing-and-messages/search-messages' },
      { type: 'page', name: 'Translate Messages 🌐', url: '/file-sharing-and-messages/translate-messages' },
      { type: 'page', name: 'Clear Cache 🧹', url: '/file-sharing-and-messages/clear-cache' },
      {
        type: 'page',
        name: 'Deleting Files and Messages 🗑️',
        url: '/file-sharing-and-messages/deleting-files-and-messages',
      },
      { type: 'page', name: 'Location Sharing 🌍', url: '/file-sharing-and-messages/location-sharing' },
      { type: 'page', name: 'Convert Incompatible Videos 🎞️', url: '/file-sharing-and-messages/video-transcoding' },
    ],
  },
  {
    type: 'folder',
    name: 'Voice and Video Calls',
    icon: sectionIcons.voice,
    index: {
      type: 'page',
      name: 'Voice and Video Calls',
      url: '/voice-and-video-calls',
    },
    children: [
      { type: 'page', name: 'Voice calls 📞', url: '/voice-and-video-calls/voice-calls' },
      {
        type: 'page',
        name: 'Video Calls & Share Screen 🎬',
        url: '/voice-and-video-calls/video-calls-and-share-screen',
      },
    ],
  },
  {
    type: 'folder',
    name: 'Technical Support & Troubleshooting',
    icon: sectionIcons.support,
    index: {
      type: 'page',
      name: 'Technical Support & Troubleshooting',
      url: '/technical-support-and-troubleshooting',
    },
    children: [
      { type: 'page', name: 'Notifications', url: '/technical-support-and-troubleshooting/notifications' },
      { type: 'page', name: 'Recover a Profile', url: '/technical-support-and-troubleshooting/recover-a-profile' },
      { type: 'page', name: 'Delete Profile', url: '/technical-support-and-troubleshooting/delete-profile' },
      { type: 'page', name: 'Keet App issues', url: '/technical-support-and-troubleshooting/keet-app-issues' },
      { type: 'page', name: 'Auto-Updates on macOS', url: '/technical-support-and-troubleshooting/auto-updates-macos' },
      { type: 'page', name: 'Sound issues', url: '/technical-support-and-troubleshooting/sound-issues' },
      { type: 'page', name: 'Video issues', url: '/technical-support-and-troubleshooting/video-issues' },
      { type: 'page', name: 'Other Issues', url: '/technical-support-and-troubleshooting/other-issues' },
      { type: 'page', name: 'Submit a Report', url: '/technical-support-and-troubleshooting/submit-a-report' },
      { type: 'page', name: 'Languages', url: '/technical-support-and-troubleshooting/languages' },
    ],
  },
  {
    type: 'folder',
    name: 'Security & Privacy',
    icon: sectionIcons.security,
    index: {
      type: 'page',
      name: 'Security & Privacy',
      url: '/security-and-privacy',
    },
    children: [
      { type: 'page', name: 'FAQs 💬', url: '/security-and-privacy/faq' },
      { type: 'page', name: 'Blind Peering 🔒', url: '/security-and-privacy/blind-peering' },
    ],
  },
  {
    type: 'page',
    name: 'Community & Support',
    url: '/community-and-support',
    icon: sectionIcons.community,
  },
];

import { IChat } from '@/types';
import getNameshortcut from './NameShortcut';

const formatedChat = (data: any, session: any): IChat[] => {
  return data.map((item) => {
    if (!item.isGroupchat) {
      const recievers = item.members.filter(
        (member) => member._id !== session.user.id,
      );
      const name = `${recievers[0].firstName} ${recievers[0].lastName}`;
      const shortcut = getNameshortcut(name);

      const updatedMembers = recievers.map((member) => {
        if (member._id !== session.user.id) {
          return {
            ...member,
            profileShortcutName: shortcut,
          };
        }
        return member; // For other members, keep them unchanged
      });
      return {
        ...item,
        name,
        members: updatedMembers,
      };
    }
    const shortcut = getNameshortcut(item.name);
    return { ...item, groupShortcut: shortcut };
  });
};

export default formatedChat;

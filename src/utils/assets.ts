// Importar assets directamente para que Vite los procese
import chatIcon from '../../public/chat-icon.png';
import aleAvatar from '../../public/ale-avatar.png';
import eleAvatar from '../../public/ele-avatar.png';
import eseAvatar from '../../public/ese-avatar.png';

// Configuración de assets para el widget
export const WIDGET_ASSETS = {
  chatIcon,
  avatars: {
    ale: aleAvatar,
    ele: eleAvatar,
    ese: eseAvatar,
    user: eleAvatar // fallback al avatar de ele
  }
};

// Función helper para obtener la ruta del avatar
export function getAvatarPath(role: string): string {
  const avatarKey = role.toLowerCase() as keyof typeof WIDGET_ASSETS.avatars;
  return WIDGET_ASSETS.avatars[avatarKey] || WIDGET_ASSETS.avatars.user;
}

// Función helper para obtener la ruta del icono de chat
export function getChatIconPath(): string {
  return WIDGET_ASSETS.chatIcon;
}
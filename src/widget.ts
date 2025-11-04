import React from 'react';
import { createRoot } from 'react-dom/client';
import Chat from './components/Chat/Chat';
import './app.css';
import type { MessageType } from './types/chat';
import type { Root } from 'react-dom/client';

// Tipos para la configuración del widget
export interface ChatWidgetConfig {
  containerId?: string;
  initialMessages?: MessageType[];
  apiUrl?: string;
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'custom';
  width?: string;
  height?: string;
  open?: boolean;
}

// Clase principal del widget
export class ChatViviendea {
  private config: ChatWidgetConfig;
  private container: HTMLElement | null = null;
  private root: Root | null = null;

  constructor(config: ChatWidgetConfig = {}) {
    this.config = {
      containerId: 'chat-viviendea-widget',
      position: 'bottom-right',
      width: '400px',
      height: '600px',
      theme: 'light',
      open: true,
      ...config
    };
  }

  // Método para inicializar el widget
  public init(): void {
    this.createContainer();
    this.render();
  }

  // Método para crear el contenedor si no existe
  private createContainer(): void {
    let container = document.getElementById(this.config.containerId!);
    
    if (!container) {
      container = document.createElement('div');
      container.id = this.config.containerId!;
      container.className = 'chat-viviendea-container';
      
      // Aplicar estilos según la posición
      this.applyContainerStyles(container);
      
      document.body.appendChild(container);
    }
    
    this.container = container;
  }

  // Aplicar estilos al contenedor
  private applyContainerStyles(container: HTMLElement): void {
    const baseStyles = {
      position: 'fixed',
      zIndex: '9999',
      width: this.config.width!,
      height: this.config.height!,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      overflow: 'hidden'
    };

    // Posicionamiento según configuración
    const positionStyles = this.getPositionStyles();

    Object.assign(container.style, baseStyles, positionStyles);
  }

  // Obtener estilos de posición
  private getPositionStyles(): Partial<CSSStyleDeclaration> {
    switch (this.config.position) {
      case 'bottom-right':
        return { bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      default:
        return {};
    }
  }

  // Renderizar el componente React
  private render(): void {
    if (!this.container) return;

    this.root = createRoot(this.container);
    this.root.render(
      React.createElement(Chat, {
        initialMessages: this.config.initialMessages,
        defaultOpen: this.config.open
      })
    );
  }

  // Método para destruir el widget
  public destroy(): void {
    if (this.root) {
      this.root.unmount();
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  // Método para mostrar/ocultar el widget
  public toggle(): void {
    if (this.container) {
      const isVisible = this.container.style.display !== 'none';
      this.container.style.display = isVisible ? 'none' : 'block';
    }
  }

  // Método para actualizar la configuración
  public updateConfig(newConfig: Partial<ChatWidgetConfig>): void {
    this.config = { ...this.config, ...newConfig };
    // Re-aplicar estilos si es necesario
    if (this.container) {
      this.applyContainerStyles(this.container);
    }
  }
}

// Función de conveniencia para inicializar el widget rápidamente
export function initChatWidget(config?: ChatWidgetConfig): ChatViviendea {
  const widget = new ChatViviendea(config);
  widget.init();
  return widget;
}

// Exportar también el componente Chat para uso directo
export { Chat };
export type { MessageType };

// Auto-inicialización si se incluye el script y hay configuración global
declare global {
  interface Window {
    ChatViviendea: typeof ChatViviendea;
    initChatWidget: typeof initChatWidget;
    chatViviendaConfig?: ChatWidgetConfig;
  }
}

// Exponer en el objeto window para uso global
if (typeof window !== 'undefined') {
  window.ChatViviendea = ChatViviendea;
  window.initChatWidget = initChatWidget;
  
  // Auto-inicialización si hay configuración global
  if (window.chatViviendaConfig) {
    initChatWidget(window.chatViviendaConfig);
  }
}
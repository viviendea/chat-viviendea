import axios from 'axios';
import { Author, type MessageType } from '../types/chat';

// Configuración base de axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiMessageRequest {
  message: string;
  userId?: string;
  conversationId?: string;
}

export interface ApiMessageResponse {
  response: string;
  timestamp?: string | Date;
  conversationId?: string;
  metadata?: Record<string, unknown>;
}

export const chatApiService = {
  /**
   * Envía un mensaje a la API y retorna la respuesta del bot
   */
  async sendMessage(request: ApiMessageRequest): Promise<ApiMessageResponse> {
    try {
      const response = await apiClient.post<ApiMessageResponse>('', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Error de conexión';
        throw new Error(`Error en la API: ${message}`);
      }
      throw new Error('Error inesperado al comunicarse con la API');
    }
  },

  /**
   * Crea un mensaje de loading para mostrar mientras se procesa la respuesta
   */
  createLoadingMessage(): MessageType {
    return { 
      content: 'Escribiendo...',
      role: Author.ELE,
      timestamp: new Date(),
      img: null,
    };
  },

  /**
   * Crea un mensaje de respuesta del bot
   */
  createBotMessage(content: string, timestamp?: string | Date): MessageType {
    return {
      content,
      role: Author.ELE,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      img: null,
    };
  },

  /**
   * Crea un mensaje de error
   */
  createErrorMessage(error: string): MessageType {
    return {
      content: `Lo siento, ocurrió un error: ${error}`,
      role: Author.ELE,
      timestamp: new Date(),
      img: null,
    };
  },
};
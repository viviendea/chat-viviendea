import axios from "axios";
import { Author, type MessageType } from "../types/chat";

// Configuración base de axios
const apiClient = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        "https://477d4vfzfvjwsndbzxp4luxbpa0dthak.lambda-url.eu-west-3.on.aws/",
    timeout: 30000,
    // Removemos las cabeceras por defecto
});

export interface ApiMessageRequest {
    message: string;
    userId?: string;
    conversationId?: string;
    session_jwt?: string;
    targetAgent?: string | null;
}

export interface ApiMessageResponse {
    message: string;
    session_jwt?: string;
    user_answers?: Record<string, unknown>;
    is_finished?: boolean;
    current_step?: string;
    expecting_open_response?: boolean;
    timestamp?: string | Date;
    conversationId?: string;
    metadata?: Record<string, unknown>;
    imagen?: string | null;
    role?: Author;
    loginUrl?: string;
}

export const chatApiService = {
    // Variable privada para almacenar el JWT de sesión
    _sessionJWT: null as string | null,

    /**
     * Inicializa la sesión del chat enviando un mensaje de inicio
     */
    async initializeSession(
        targetAgent: string | null = null
    ): Promise<ApiMessageResponse | null> {
        try {
            const initRequest = {
                message: "hol",
                userId: "user-123",
                conversationId: "conversation-123",
                targetAgent: targetAgent ?? null,
            };

            const response = await apiClient.post<ApiMessageResponse>(
                "",
                initRequest
            );

            if (response.data.session_jwt) {
                this._sessionJWT = response.data.session_jwt;
            }

            return response.data;
        } catch (error) {
            console.error("Error al inicializar sesión:", error);
            return null;
        }
    },

    /**
     * Envía un mensaje a la API y retorna la respuesta del bot
     */
    async sendMessage(request: ApiMessageRequest): Promise<ApiMessageResponse> {
        try {
            // Incluir el JWT de sesión si está disponible
            const requestWithJWT: ApiMessageRequest = {
                ...request,
                session_jwt: this._sessionJWT || undefined,
            };

            const response = await apiClient.post<ApiMessageResponse>(
                "",
                requestWithJWT
            );

            // Actualizar el JWT si viene uno nuevo en la respuesta
            if (response.data.session_jwt) {
                this._sessionJWT = response.data.session_jwt;
            }

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Manejo específico de errores de CORS
                if (
                    error.code === "ERR_NETWORK" &&
                    error.message.includes("fetch")
                ) {
                    throw new Error(
                        "Error de CORS: La lambda no permite peticiones desde este dominio"
                    );
                }

                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Error de conexión";
                console.error("Error details:", {
                    code: error.code,
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    message: error.message,
                });
                throw new Error(`Error en la API: ${message}`);
            }
            throw new Error("Error inesperado al comunicarse con la API");
        }
    },

    /**
     * Crea un mensaje de loading para mostrar mientras se procesa la respuesta
     */
    createLoadingMessage(): MessageType {
        return {
            content: "Pensando...",
            role: Author.ELE,
            timestamp: new Date(),
            img: null,
        };
    },

    /**
     * Crea un mensaje de respuesta del bot
     */
    createBotMessage(
        content: string,
        timestamp?: string | Date,
        img?: string | null,
        role: Author = Author.ELE,
        isFinished?: boolean,
        loginUrl?: string
    ): MessageType {
        return {
            content,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            img: img || null,
            role,
            isFinished: isFinished || false,
            loginUrl,
        };
    },

    /**
     * Resetea la sesión (útil para testing o logout)
     */
    resetSession(): void {
        this._sessionJWT = null;
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

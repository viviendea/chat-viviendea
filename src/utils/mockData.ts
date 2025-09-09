import { Author, type MessageType } from "../types/chat";

// @utils/mockData.ts o directamente en tu componente
export const mockConversation: MessageType[] = [
    {
        content:
            "¡Hola! Soy Ele y voy a guiarte en el diseño de tu vivienda ideal. Pero primero empezemos por lo más importante, ¿Dónde te gustaría vivir?",
        role: Author.ELE,
        timestamp: new Date("2024-09-09T14:30:15"),
        img: null,
    },
    {
        content: "Hola, estoy interesado en diseñar mi nueva casa",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:30:00"),
        img: null,
    },

    {
        content:
            "Me gustaría vivir en Madrid, en una zona céntrica pero tranquila",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:31:20"),
        img: null,
    },
    {
        content:
            "Perfecto, Madrid tiene zonas muy interesantes. ¿Qué tipo de vivienda tienes en mente? ¿Un apartamento, un dúplex, o prefieres una casa unifamiliar?",
        role: Author.ELE,
        timestamp: new Date("2024-09-09T14:31:35"),
        img: null,
    },
    {
        content:
            "Creo que me gusta más la idea de un apartamento, algo moderno",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:32:10"),
        img: null,
    },
    {
        content:
            "Excelente elección. Los apartamentos modernos ofrecen muchas posibilidades. ¿Cuántas habitaciones necesitarías? ¿Vives solo, en pareja, o tienes familia?",
        role: Author.ELE,
        timestamp: new Date("2024-09-09T14:32:25"),
        img: null,
    },
    {
        content:
            "Vivo con mi pareja y estamos pensando en tener hijos pronto, así que necesitaríamos al menos 3 habitaciones",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:33:00"),
        img: null,
    },
    {
        content:
            "Perfecto, 3 habitaciones es una muy buena distribución para una familia. ¿Tienes algún estilo arquitectónico que te guste especialmente? Por ejemplo: minimalista, industrial, escandinavo, mediterráneo...",
        role: Author.ELE,
        timestamp: new Date("2024-09-09T14:33:20"),
        img: null,
    },
    {
        content:
            "Me encanta el estilo escandinavo, esa sensación de calidez y naturaleza",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:33:50"),
        img: null,
    },
    {
        content:
            "¡Fantástica elección! El estilo escandinavo es perfecto para crear un hogar acogedor. Con maderas claras, colores neutros y mucha luz natural. ¿Qué presupuesto aproximado manejas para este proyecto?",
        role: Author.ELE,
        timestamp: new Date("2024-09-09T14:34:10"),
        img: null,
    },
    {
        content: "Tenemos un presupuesto de alrededor de 400.000€",
        role: Author.USER,
        timestamp: new Date("2024-09-09T14:34:45"),
    },
    {
        content:
            "Excelente, con ese presupuesto podemos crear algo realmente especial. Basándome en tus preferencias, te voy a diseñar algunas propuestas que incluyan: apartamento de 3 habitaciones en Madrid, estilo escandinavo, espacios abiertos y mucha luz natural. ¿Te parece bien que empecemos con los planos?",
        role: Author.ESE,
        timestamp: new Date("2024-09-09T14:35:00"),
        img: "https://planos-spain.viviendea.com/?tecnico=0&planta=0&estancia=46&padding=50&opciones=124:54:22:7",
    },
];

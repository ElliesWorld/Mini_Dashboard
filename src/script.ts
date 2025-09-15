interface Book
{
    id: string;
    title: string;
    authors: string[];
    publishYear: number | string;
    languages: string[];
    available: boolean;
    subjects: string[];
}

interface LibraryBook
{
    key?: string;
    title?: string;
    author_name?: string[];
    publish_year?: number;
    language?: string[];
    subject?: string[];
}

interface WeatherData
{
    current_weather:
    {
        temperature: number;
        weathercode: number;
        windspeed: number;
        time: string;
    };
    daily?:
    {
        temp_max: number[];
        temp_min: number[];
    };
}

interface Location
{
    latitude: number;
    longitude: number;
}

interface WeatherRecommendation
{
    suggestion: string;
    genres: string[];
    bookTitle string;
}

interface BookStats
{
    total: number;
    available: number;
}

interface WeatherElements {
    icon: HTMLElement | null;
    condition: HTMLElement | null;
    temp: HTMLElement | null;
    suggestion: HTMLElement | null;
    genres: HTMLElement | null;
    book: HTMLElement | null;
}

type SearchType = 'all' | 'title' | 'author' | 'keyword';
type WeatherCondition = 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm' | 'Drizzle';
type SortOption = 'relevance' | 'title' | 'author' | 'year';



import questionBank from '../../server/questions.json';

export type SchoolLevel =
    | 'podstawowa_4_6'
    | 'podstawowa_7_8'
    | 'liceum_podst'
    | 'liceum_rozsz'
    | 'studia_tech_1rok';

export type Difficulty =
    | 'latwe'
    | 'srednie'
    | 'trudne'
    | 'bardzo_trudne';

export interface Question {
    id: string;
    text: string;
    answer: string | number;
    schoolLevel: SchoolLevel;
    difficulty: Difficulty;
}

export interface Category {
    id: string;
    name: string;
    questions: Question[];
}

export const categories = questionBank as Category[];

export const schoolLevelNames: Record<SchoolLevel, string> = {
    'podstawowa_4_6': 'Szkoła Podstawowa (klasy 4-6)',
    'podstawowa_7_8': 'Szkoła Podstawowa (klasy 7-8)',
    'liceum_podst': 'Liceum/Technikum (poziom podstawowy)',
    'liceum_rozsz': 'Liceum/Technikum (poziom rozszerzony)',
    'studia_tech_1rok': 'Studia Techniczne (1 rok)'
};

export type SchoolLevel =
    | 'podstawowa_4_6' // Primary school grades 4-6
    | 'podstawowa_7_8' // Primary school grades 7-8
    | 'liceum_podst'   // High school, basic level
    | 'liceum_rozsz'   // High school, extended level
    | 'studia_tech_1rok'; // Technical university, 1st year

export type Difficulty =
    | 'latwe'          // Easy
    | 'srednie'        // Medium
    | 'trudne'         // Hard
    | 'bardzo_trudne'; // Very hard

export interface Question {
    id: string;
    text: string;
    answer: string | number;
    schoolLevel: SchoolLevel;
    difficulty: Difficulty;
    // Można tu dodać więcej pól, np. hints, solutionSteps, etc.
}

export interface Category {
    id: string;
    name: string;
    questions: Question[];
}

export const categories: Category[] = [
    {
        id: 'algebra',
        name: 'Algebra',
        questions: [
            { id: 'alg1', text: "Rozwiąż równanie: 2x + 5 = 11", answer: 3, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'alg2', text: "Uprość wyrażenie: (a+b)^2 - (a-b)^2", answer: "4ab", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'alg3', text: "Rozwiąż nierówność: 3x - 4 > 5", answer: "x > 3", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'alg4', text: "Znajdź pierwiastki równania kwadratowego: x^2 - 5x + 6 = 0", answer: "x=2 lub x=3", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'alg5', text: "Oblicz wartość wyrażenia: (2^3 * 2^-1) / 2^2", answer: 1, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'alg6', text: "Rozwiąż układ równań: x + y = 5, x - y = 1", answer: "x=3, y=2", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'alg7', text: "Wyznacz dziedzinę funkcji f(x) = 1 / (x-2)", answer: "R \\ {2}", schoolLevel: 'liceum_podst', difficulty: 'srednie'},
            { id: 'alg8', text: "Oblicz logarytm: log_2(8)", answer: 3, schoolLevel: 'liceum_podst', difficulty: 'latwe'},
            { id: 'alg9', text: "Przedstaw w postaci jednej potęgi: (a^3 * a^4) / a^2", answer: "a^5", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe'},
            { id: 'alg10', text: "Rozwiąż równanie wykładnicze: 2^x = 16", answer: 4, schoolLevel: 'liceum_podst', difficulty: 'latwe'},
            { id: 'alg11', text: "Oblicz procent: 20% z liczby 150.", answer: 30, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'alg12', text: "Podaj wartość bezwzględną liczby -7.", answer: 7, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'alg13', text: "Rozwiąż równanie logarytmiczne: log(x) = 2 (podstawa 10).", answer: 100, schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'alg14', text: "Uprość: sqrt(72)", answer: "6 * sqrt(2)", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'alg15', text: "Oblicz NWD(12, 18).", answer: 6, schoolLevel: 'podstawowa_4_6', difficulty: 'srednie' },
            { id: 'alg16', text: "Rozwiąż nierówność kwadratową: x^2 - 4 < 0", answer: "x ∈ (-2, 2)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'alg17', text: "Oblicz wartość wyrażenia | -5 + 2 | - | 3 - 7 |.", answer: -1, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'alg18', text: "Wykonaj dzielenie wielomianów: (x^3 - 1) / (x - 1)", answer: "x^2 + x + 1", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'alg19', text: "Dla jakiej wartości parametru m funkcja liniowa f(x) = (m-1)x + 3 jest malejąca?", answer: "m < 1", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'alg20', text: "Rozwiąż równanie z wartością bezwzględną: |x + 2| = 7", answer: "x = 5 lub x = -9", schoolLevel: 'liceum_podst', difficulty: 'srednie' }
        ]
    },
    {
        id: 'geometry',
        name: 'Geometria',
        questions: [
            { id: 'geo1', text: "Oblicz pole trójkąta o podstawie 10 i wysokości 5.", answer: 25, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'geo2', text: "Jaka jest suma kątów wewnętrznych w pięciokącie?", answer: 540, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo3', text: "Oblicz obwód koła o promieniu 7.", answer: "14π", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'geo4', text: "Pole kwadratu wynosi 49 cm^2. Jaka jest długość jego boku?", answer: "7 cm", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'geo5', text: "Oblicz objętość sześcianu o krawędzi 3 cm.", answer: "27 cm^3", schoolLevel: 'podstawowa_4_6', difficulty: 'srednie' },
            { id: 'geo6', text: "W trójkącie prostokątnym przyprostokątne mają długości 3 i 4. Ile wynosi przeciwprostokątna?", answer: 5, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo7', text: "Ile przekątnych ma sześciokąt wypukły?", answer: 9, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo8', text: "Oblicz pole rombu o przekątnych 6 i 8.", answer: 24, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo9', text: "Jaka jest miara kąta wpisanego opartego na półokręgu?", answer: "90 stopni", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo10', text: "Oblicz pole powierzchni kuli o promieniu 5.", answer: "100π", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo11', text: "Podaj twierdzenie Pitagorasa.", answer: "a^2 + b^2 = c^2", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'geo12', text: "Oblicz pole trapezu o podstawach 6 i 10 oraz wysokości 4.", answer: 32, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo13', text: "Jaka jest objętość walca o promieniu podstawy r=2 i wysokości h=5?", answer: "20π", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo14', text: "Ile wynosi suma miar kątów w trójkącie?", answer: 180, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'geo15', text: "Dwa kąty trójkąta mają miary 30 i 60 stopni. Jaka jest miara trzeciego kąta?", answer: 90, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'geo16', text: "Oblicz pole koła wpisanego w kwadrat o boku 4 cm.",  answer: "4π cm^2", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo17', text: "Jaka jest długość przekątnej sześcianu o krawędzi 'a'?", answer: "a√3", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo18', text: "Podaj wzór na pole trójkąta równobocznego o boku 'a'.", answer: "(a^2 * √3) / 4", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'geo19', text: "Ile wynosi objętość stożka o promieniu podstawy r=3 i wysokości h=4?", answer: "12π (V = 1/3 * π * r^2 * h)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'geo20', text: "Kąt środkowy oparty na łuku jest dwa razy większy od kąta wpisanego opartego na tym samym łuku. Prawda czy fałsz?", answer: "Prawda", schoolLevel: 'liceum_podst', difficulty: 'latwe' }
        ]
    },
    {
        id: 'functions',
        name: 'Funkcje',
        questions: [
            { id: 'fun1', text: "Dla f(x) = 3x - 7, oblicz f(4).", answer: 5, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'fun2', text: "Jaki jest zbiór wartości funkcji y = x^2?", answer: "[0, +∞)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'fun3', text: "Podaj miejsce zerowe funkcji f(x) = 2x - 6.", answer: 3, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'fun4', text: "Czy funkcja f(x) = x^3 jest parzysta, nieparzysta, czy żadna z nich?", answer: "nieparzysta", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'fun5', text: "Dla f(x) = |x|, oblicz f(-5).", answer: 5, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'fun6', text: "Jaka jest asymptota pionowa funkcji f(x) = 1/(x-3)?", answer: "x=3", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'fun7', text: "Określ monotoniczność funkcji f(x) = -2x + 1.", answer: "malejąca", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'fun8', text: "Podaj wzór funkcji odwrotnej do f(x) = x + 2.", answer: "f^-1(x) = x - 2", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'fun9', text: "Dla jakich argumentów funkcja f(x) = (x-1)(x+2) przyjmuje wartości ujemne?", answer: "(-2, 1)", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'fun10', text: "Jaki jest okres podstawowy funkcji f(x) = sin(x)?", answer: "2π", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'fun11', text: "Podaj dziedzinę funkcji f(x) = sqrt(x).", answer: "[0, +∞)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'fun12', text: "Dla f(x) = x^2, oblicz f(f(2)).", answer: 16, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'fun13', text: "Jaki jest współczynnik kierunkowy prostej y = -3x + 5?", answer: -3, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'fun14', text: "Podaj przykład funkcji rosnącej.", answer: "np. f(x) = x", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'fun15', text: "Czy punkt (1,2) należy do wykresu funkcji y = x+1?", answer: "Tak", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'fun16', text: "Dla f(x) = 2^x, oblicz f(3).", answer: 8, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'fun17', text: "Jaka jest dziedzina funkcji f(x) = log(x-1)?", answer: "(1, +∞)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'fun18', text: "Podaj przykład funkcji, która jest jednocześnie parzysta i nieparzysta.", answer: "f(x) = 0", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'fun19', text: "Określ, czy funkcja f(x) = 1/x jest ciągła w punkcie x=0.", answer: "Nie", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'fun20', text: "Dla f(x) = x^2 - 3x + 2, znajdź współrzędne wierzchołka paraboli.", answer: "W = (3/2, -1/4) (p=-b/2a, q=-Δ/4a)", schoolLevel: 'liceum_podst', difficulty: 'trudne' }
        ]
    },
    {
        id: 'trigonometry',
        name: 'Trygonometria',
        questions: [
            { id: 'trg1', text: "Oblicz sin(30°).", answer: "1/2", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg2', text: "Oblicz cos(60°).", answer: "1/2", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg3', text: "Oblicz tg(45°).", answer: 1, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg4', text: "Uprość wyrażenie: sin^2(x) + cos^2(x).", answer: 1, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg5', text: "W trójkącie prostokątnym, jeśli sin(α) = 3/5, ile wynosi cos(α)? (α jest kątem ostrym)", answer: "4/5", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg6', text: "Rozwiąż równanie: sin(x) = 1 dla x ∈ [0, 2π].", answer: "π/2", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg7', text: "Jaka jest wartość ctg(90°)?", answer: 0, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg8', text: "Podaj wartość sin(150°).", answer: "1/2", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg9', text: "Użyj wzoru redukcyjnego: cos(180° - α) = ?", answer: "-cos(α)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg10', text: "W trójkącie ABC, a=4, sin(A)=1/2, b=6. Oblicz sin(B) (Twierdzenie sinusów).", answer: "3/4", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'trg11', text: "Zamień 90 stopni na radiany.", answer: "π/2", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg12', text: "Oblicz 2sin(30°)cos(30°).", answer: "sqrt(3)/2 (lub sin(60°))", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg13', text: "Jaka jest maksymalna wartość funkcji y = cos(x)?", answer: 1, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg14', text: "Dla jakiego kąta ostrego sin(α) = cos(α)?", answer: "45° (lub π/4)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg15', text: "Podaj twierdzenie cosinusów.", answer: "c^2 = a^2 + b^2 - 2ab cos(γ)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'trg16', text: "Oblicz sin(0) + cos(0) + tg(0).", answer: 1, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'trg17', text: "Dla jakich wartości x wyrażenie tg(x) jest niezdefiniowane (w zakresie 0 do 2π)?", answer: "π/2, 3π/2", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg18', text: "Uprość: (1 - cos^2(x)) / sin(x), zakładając sin(x) ≠ 0.", answer: "sin(x)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'trg19', text: "Jaka jest amplituda funkcji y = 3sin(2x)?", answer: 3, schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'trg20', text: "Rozwiąż równanie: cos(x) = -1 dla x ∈ [0, 2π].", answer: "π", schoolLevel: 'liceum_podst', difficulty: 'srednie' }
        ]
    },
    {
        id: 'probability',
        name: 'Rachunek Prawdopodobieństwa',
        questions: [
            { id: 'prb1', text: "Jakie jest prawdopodobieństwo wyrzucenia orła w pojedynczym rzucie monetą?", answer: "1/2", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb2', text: "Jakie jest prawdopodobieństwo wyrzucenia szóstki w pojedynczym rzucie kostką sześcienną?", answer: "1/6", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb3', text: "Rzucamy dwiema kostkami. Jakie jest prawdopodobieństwo, że suma oczek wyniesie 7?", answer: "6/36 lub 1/6", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb4', text: "W urnie są 3 kule białe i 2 czarne. Losujemy jedną kulę. Jakie jest prawdopodobieństwo wylosowania kuli białej?", answer: "3/5", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'prb5', text: "Ile jest możliwych wyników przy rzucie trzema monetami?", answer: 8, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb6', text: "Na ile sposobów można ustawić 4 różne książki na półce?", answer: "24 (4!)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb7', text: "Wybieramy losowo jedną literę z wyrazu MATEMATYKA. Jakie jest prawdopodobieństwo, że będzie to litera A?", answer: "3/10", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'prb8', text: "Jakie jest prawdopodobieństwo wylosowania asa z talii 52 kart?", answer: "4/52 lub 1/13", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'prb9', text: "Rzucamy kostką. Jakie jest prawdopodobieństwo, że wypadnie liczba oczek mniejsza niż 3?", answer: "2/6 lub 1/3", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb10', text: "W klasie jest 15 dziewcząt i 10 chłopców. Wybieramy losowo jedną osobę. Jakie jest prawdopodobieństwo, że będzie to chłopiec?", answer: "10/25 lub 2/5", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb11', text: "Co to jest zdarzenie pewne? Podaj przykład.", answer: "Zdarzenie, które na pewno zajdzie, np. wyrzucenie mniej niż 7 oczek na kostce. Prawdopodobieństwo = 1.", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb12', text: "Co to jest zdarzenie niemożliwe? Podaj przykład.", answer: "Zdarzenie, które nie może zajść, np. wyrzucenie 7 oczek na kostce. Prawdopodobieństwo = 0.", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb13', text: "Rzucamy monetą dwa razy. Jakie jest prawdopodobieństwo uzyskania dwóch orłów?", answer: "1/4", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb14', text: "W talii 52 kart losujemy jedną. Jakie jest prawdopodobieństwo, że nie będzie to król?", answer: "48/52 lub 12/13", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb15', text: "Prawdopodobieństwo deszczu jutro wynosi 0.3. Jakie jest prawdopodobieństwo, że nie będzie padać?", answer: 0.7, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb16', text: "Rzucamy dwiema monetami. Jakie jest prawdopodobieństwo uzyskania co najmniej jednego orła?", answer: "3/4", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'prb17', text: "W pudełku jest 5 kul czerwonych i 3 niebieskie. Losujemy dwie kule bez zwracania. Jakie jest prawdopodobieństwo wylosowania dwóch kul czerwonych?", answer: "(5/8) * (4/7) = 20/56 = 5/14", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'prb18', text: "Co to jest wartość oczekiwana zmiennej losowej?", answer: "Średnia ważona możliwych wartości zmiennej, gdzie wagami są prawdopodobieństwa tych wartości.", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'prb19', text: "Ile jest wszystkich możliwych wyników przy jednoczesnym rzucie kostką i monetą?", answer: "12 (6 * 2)", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'prb20', text: "Zdarzenia A i B są niezależne. P(A)=0.5, P(B)=0.4. Oblicz P(A ∩ B).", answer: "0.2 (0.5 * 0.4)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' }
        ]
    },
    {
        id: 'sequences',
        name: 'Ciągi Liczbowe',
        questions: [
            { id: 'seq1', text: "Podaj piąty wyraz ciągu arytmetycznego, w którym a1=2 i r=3.", answer: 14, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'seq2', text: "Podaj czwarty wyraz ciągu geometrycznego, w którym a1=1 i q=2.", answer: 8, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'seq3', text: "Oblicz sumę pierwszych 10 wyrazów ciągu arytmetycznego, gdzie a1=1 i a10=19.", answer: 100, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq4', text: "Czy ciąg an = 2n - 1 jest arytmetyczny czy geometryczny?", answer: "arytmetyczny", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'seq5', text: "Oblicz granicę ciągu an = 1/n gdy n dąży do nieskończoności.", answer: 0, schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'seq6', text: "Podaj wzór na n-ty wyraz ciągu, którego kolejne wyrazy to: 2, 4, 6, 8...", answer: "an = 2n", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'seq7', text: "Oblicz sumę nieskończonego ciągu geometrycznego: 1 + 1/2 + 1/4 + ...", answer: 2, schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'seq8', text: "W ciągu arytmetycznym a3=7 i a5=11. Oblicz a1.", answer: 3, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq9', text: "Ile wynosi różnica ciągu arytmetycznego, jeśli a2=5 i a4=9?", answer: 2, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq10', text: "Podaj trzy kolejne wyrazy ciągu geometrycznego, jeśli a1=3 i q=-2.", answer: "3, -6, 12", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq11', text: "Jaki jest iloraz ciągu geometrycznego: 2, 6, 18, 54...?", answer: 3, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'seq12', text: "Czy ciąg an = n^2 jest arytmetyczny?", answer: "Nie", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq13', text: "Oblicz sumę pierwszych 5 wyrazów ciągu geometrycznego, gdzie a1=2 i q=3.", answer: "2 * (3^5 - 1) / (3-1) = 2 * (243-1)/2 = 242", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq14', text: "Podaj wzór ogólny ciągu: 1, 4, 9, 16, ...", answer: "an = n^2", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'seq15', text: "Czy ciąg an = (-1)^n jest zbieżny?", answer: "Nie (jest rozbieżny)", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'seq16', text: "Podaj wzór na sumę n początkowych wyrazów ciągu arytmetycznego.", answer: "Sn = n/2 * (a1 + an) lub Sn = n/2 * (2a1 + (n-1)r)", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'seq17', text: "Podaj wzór na sumę n początkowych wyrazów ciągu geometrycznego.", answer: "Sn = a1 * (1 - q^n) / (1 - q)", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'seq18', text: "Ciąg (2, x, 8) jest arytmetyczny. Oblicz x.", answer: 5, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq19', text: "Ciąg (2, x, 8) jest geometryczny (x>0). Oblicz x.", answer: 4, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'seq20', text: "Oblicz granicę ciągu an = (2n+1)/(n+3) gdy n dąży do nieskończoności.", answer: 2, schoolLevel: 'liceum_rozsz', difficulty: 'srednie' }
        ]
    },
    {
        id: 'combinatorics',
        name: 'Kombinatoryka',
        questions: [
            { id: 'cmb1', text: "Ile jest liczb dwucyfrowych, w których cyfry się nie powtarzają?", answer: 81, schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb2', text: "Na ile sposobów można wybrać 3 osoby z grupy 5 osób?", answer: "10 (C(5,3))", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb3', text: "Ile jest permutacji zbioru {A, B, C}?", answer: "6 (3!)", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb4', text: "Mamy 5 różnych smaków lodów. Na ile sposobów można wybrać 2 różne gałki?", answer: 10, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb5', text: "Ile jest możliwych kodów PIN składających się z 4 cyfr (cyfry mogą się powtarzać)?", answer: "10000 (10^4)", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb6', text: "Na ile sposobów można rozdać 5 różnych kart 5 graczom, po jednej karcie dla każdego?", answer: "120 (5!)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb7', text: "Ile jest liczb trzycyfrowych parzystych o różnych cyfrach?", answer: "328 (należy rozbić na przypadki: ostatnia 0 -> 8*7*1=56; ostatnia 2,4,6,8 -> 7*7*4=196. Błąd w poprzedniej odpowiedzi, powinno być: jeśli ostatnia 0: 9*8*1=72. Jeśli ostatnia {2,4,6,8} (4 opcje): pierwsza nie 0 i nie ostatnia (8 opcji), druga nie pierwsza i nie ostatnia (8 opcji). 4 * 8 * 8 = 256. Poprawna odpowiedź to 328.", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'cmb8', text: "Ile jest możliwych ustawień 6 osób w kolejce?", answer: "720 (6!)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb9', text: "W pudełku jest 10 kul ponumerowanych od 1 do 10. Losujemy 3 kule bez zwracania. Ile jest możliwych wyników losowania, jeśli kolejność nie ma znaczenia?", answer: "120 (C(10,3))", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb10', text: "Ile jest różnych słów (mających sens lub nie) możliwych do utworzenia z liter słowa KOT?", answer: 6, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'cmb11', text: "Oblicz 5! (silnia).", answer: 120, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb12', text: "Na ile sposobów można wybrać przewodniczącego i zastępcę z klasy 20-osobowej?", answer: "20 * 19 = 380 (V(20,2))", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb13', text: "Ile jest podzbiorów zbioru 3-elementowego?", answer: "8 (2^3)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'cmb14', text: "Rzucamy dwiema kostkami. Ile jest możliwych wyników?", answer: 36, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'cmb15', text: "Ile jest liczb czterocyfrowych mniejszych od 3000 utworzonych z cyfr {1,2,3,4} bez powtórzeń?", answer: "Pierwsza cyfra 1 lub 2 (2 opcje). Reszta 3! = 6. Razem 2*6 = 12.", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'cmb16', text: "Co oznacza symbol Newtona (n po k)?", answer: "Liczba k-elementowych kombinacji zbioru n-elementowego.", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'cmb17', text: "Na ile sposobów można wybrać delegację składającą się z 2 chłopców i 1 dziewczyny z grupy 5 chłopców i 4 dziewczyn?", answer: "C(5,2) * C(4,1) = 10 * 4 = 40", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'cmb18', text: "Ile jest różnych rozmieszczeń 3 nierozróżnialnych kul w 2 rozróżnialnych komórkach?", answer: "4 ( (3,0), (2,1), (1,2), (0,3) )", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'cmb19', text: "Ile jest liczb pięciocyfrowych, w których wszystkie cyfry są różne?", answer: "9 * 9 * 8 * 7 * 6 = 27216", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'cmb20', text: "Na ile sposobów można ustawić w kole 5 osób?", answer: "(5-1)! = 4! = 24", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' }
        ]
    },
    {
        id: 'calculus_basics',
        name: 'Podstawy Analizy (Pochodne, Całki)',
        questions: [
            { id: 'calc1', text: "Oblicz pochodną funkcji f(x) = x^2.", answer: "2x", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc2', text: "Oblicz pochodną funkcji f(x) = sin(x).", answer: "cos(x)", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc3', text: "Oblicz pochodną funkcji f(x) = 3x^3 - 2x + 5.", answer: "9x^2 - 2", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc4', text: "Oblicz całkę nieoznaczoną ∫ 2x dx.", answer: "x^2 + C", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc5', text: "Oblicz całkę nieoznaczoną ∫ cos(x) dx.", answer: "sin(x) + C", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc6', text: "Jaka jest pochodna funkcji stałej f(x) = 7?", answer: 0, schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc7', text: "Oblicz pochodną f(x) = e^x.", answer: "e^x", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc8', text: "Oblicz całkę oznaczoną ∫ (od 0 do 1) x dx.", answer: "1/2", schoolLevel: 'studia_tech_1rok', difficulty: 'srednie' },
            { id: 'calc9', text: "Znajdź ekstrema lokalne funkcji f(x) = x^2 - 4x + 1.", answer: "minimum w x=2", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc10', text: "Oblicz pochodną iloczynu: (uv)' = ?", answer: "u'v + uv'", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc11', text: "Oblicz pochodną f(x) = ln(x).", answer: "1/x", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc12', text: "Oblicz całkę ∫ 1/x dx.", answer: "ln|x| + C", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc13', text: "Co oznacza f'(x) > 0 na przedziale (a,b)?", answer: "Funkcja jest rosnąca na (a,b)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc14', text: "Oblicz granicę lim (x->0) sin(x)/x.", answer: 1, schoolLevel: 'studia_tech_1rok', difficulty: 'trudne' },
            { id: 'calc15', text: "Oblicz pochodną funkcji złożonej: (f(g(x)))\' = ?", answer: "f\'(g(x)) * g\'(x) (reguła łańcuchowa)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc16', text: "Oblicz całkę oznaczoną ∫ (od 1 do e) 1/x dx.", answer: 1, schoolLevel: 'studia_tech_1rok', difficulty: 'srednie' },
            { id: 'calc17', text: "Co to jest asymptota pozioma funkcji?", answer: "Prosta y=a, do której wykres funkcji zbliża się, gdy x dąży do ±nieskończoności.", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc18', text: "Oblicz pochodną funkcji f(x) = x^n.", answer: "n*x^(n-1)", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'calc19', text: "Podaj interpretację geometryczną całki oznaczonej ∫ (od a do b) f(x) dx, gdy f(x) >= 0.", answer: "Pole obszaru pod wykresem funkcji f(x) od x=a do x=b.", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'calc20', text: "Znajdź punkty przegięcia funkcji f(x) = x^3 - 3x^2.", answer: "x=1 (f\'\'(x) = 6x - 6, f\'\'(x)=0 dla x=1)", schoolLevel: 'studia_tech_1rok', difficulty: 'trudne' }
        ]
    },
    {
        id: 'logic_sets',
        name: 'Logika i Zbiory',
        questions: [
            { id: 'log1', text: "Co to jest tautologia? Podaj przykład.", answer: "Zdanie logiczne zawsze prawdziwe, np. p ∨ ¬p", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log2', text: "Podaj prawo De Morgana dla sumy zbiorów: (A ∪ B)' = ?", answer: "A' ∩ B'", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log3', text: "Jeśli A = {1,2,3} i B = {3,4,5}, to A ∩ B = ?", answer: "{3}", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'log4', text: "Jeśli A = {1,2,3} i B = {3,4,5}, to A ∪ B = ?", answer: "{1,2,3,4,5}", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'log5', text: "Co to jest zbiór pusty?", answer: "Zbiór, który nie zawiera żadnych elementów, oznaczany jako {} lub Ø", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'log6', text: "Ile podzbiorów ma zbiór {a, b}?", answer: "4 (Ø, {a}, {b}, {a,b})", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log7', text: "Co oznacza A ⊂ B?", answer: "Zbiór A jest podzbiorem zbioru B (każdy element A należy też do B)", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'log8', text: "Podaj zaprzeczenie zdania: \"Każdy kwadrat jest prostokątem.\"", answer: "\"Istnieje kwadrat, który nie jest prostokątem.\" (co jest fałszem)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log9', text: "Co to jest iloczyn kartezjański zbiorów A i B?", answer: "Zbiór wszystkich uporządkowanych par (a,b) takich, że a ∈ A i b ∈ B.", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'log10', text: "Czy zdanie \"Jeśli 2+2=5, to Słońce jest gwiazdą\" jest prawdziwe?", answer: "Tak (implikacja p => q jest fałszywa tylko gdy p jest prawdziwe i q fałszywe)", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'log11', text: "Co to jest alternatywa zdań p i q? Kiedy jest prawdziwa?", answer: "p ∨ q (p lub q). Prawdziwa, gdy co najmniej jedno ze zdań p, q jest prawdziwe.", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log12', text: "Co to jest koniunkcja zdań p i q? Kiedy jest prawdziwa?", answer: "p ∧ q (p i q). Prawdziwa, gdy oba zdania p, q są prawdziwe.", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log13', text: "Jeśli A = {x: x jest liczbą parzystą} i B = {x: x jest liczbą pierwszą}, podaj A ∩ B.", answer: "{2}", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log14', text: "Co to jest zbiór liczb naturalnych?", answer: "{1, 2, 3, ...} lub {0, 1, 2, 3, ...} w zależności od definicji.", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'log15', text: "Podaj przykład zdania złożonego, które jest zawsze fałszywe (sprzeczność).", answer: "p ∧ ¬p", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log16', text: "Co to jest kwantyfikator ogólny i szczegółowy?", answer: "Ogólny (∀) - \"dla każdego\", szczegółowy (∃) - \"istnieje\".", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log17', text: "Jeśli A jest zbiorem liczb parzystych, a B zbiorem liczb podzielnych przez 3, co reprezentuje A ∩ B?", answer: "Zbiór liczb podzielnych przez 6.", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'log18', text: "Co to jest dopełnienie zbioru A (A\')?", answer: "Zbiór wszystkich elementów przestrzeni U, które nie należą do A.", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'log19', text: "Czy zbiór liczb wymiernych jest przeliczalny?", answer: "Tak", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'log20', text: "Podaj prawo kontrapozycji dla implikacji (p ⇒ q).", answer: "(¬q ⇒ ¬p)", schoolLevel: 'liceum_podst', difficulty: 'srednie' }
        ]
    },
    {
        id: 'percentages_interest',
        name: 'Procenty i Odsetki',
        questions: [
            { id: 'perc1', text: "Zamień 25% na ułamek dziesiętny.", answer: 0.25, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'perc2', text: "Zamień ułamek 3/4 na procenty.", answer: "75%", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'perc3', text: "Cena towaru wzrosła o 10% z 200 zł. Jaka jest nowa cena?", answer: "220 zł", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc4', text: "Cena towaru spadła o 20% do 80 zł. Jaka była cena początkowa?", answer: "100 zł", schoolLevel: 'podstawowa_7_8', difficulty: 'trudne' },
            { id: 'perc5', text: "Kapitał 1000 zł złożono na lokacie z oprocentowaniem 5% rocznie. Ile odsetek przyniesie po roku (bez podatku)?", answer: "50 zł", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc6', text: "Jaki procent liczby 50 stanowi liczba 10?", answer: "20%", schoolLevel: 'podstawowa_4_6', difficulty: 'srednie' },
            { id: 'perc7', text: "Liczba o 15% większa od 60 to...?", answer: 69, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc8', text: "W klasie jest 25 uczniów, a 40% z nich to dziewczęta. Ile jest dziewcząt?", answer: 10, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'perc9', text: "VAT na usługę wynosi 23%. Jaka jest cena brutto, jeśli cena netto to 100 zł?", answer: "123 zł", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc10', text: "Promil to jaka część całości?", answer: "1/1000 (jedna tysięczna)", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'perc11', text: "Oblicz 0.5% z 2000.", answer: 10, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc12', text: "Towar kosztował 150 zł, a teraz kosztuje 120 zł. O ile procent staniał?", answer: "20% ((150-120)/150 * 100%)", schoolLevel: 'podstawowa_7_8', difficulty: 'trudne' },
            { id: 'perc13', text: "Co to jest procent składany?", answer: "Sposób oprocentowania kapitału, w którym odsetki są doliczane do kapitału i w kolejnym okresie odsetkowym same procentują.", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'perc14', text: "Jeśli inflacja wynosi 5%, a twoja pensja wzrosła o 3%, to realnie twoja siła nabywcza wzrosła czy zmalała?", answer: "Zmalała", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'perc15', text: "Punkt procentowy a procent - jaka jest różnica?", answer: "Punkt procentowy to różnica między dwiema wartościami procentowymi. Np. wzrost z 5% do 6% to wzrost o 1 punkt procentowy, ale o 20% ((6-5)/5).", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'perc16', text: "Kapitał 2000 zł złożono na lokacie z oprocentowaniem 3% rocznie, kapitalizacja roczna. Ile wyniesie kapitał po 2 latach (bez podatku)?", answer: "2000 * (1.03)^2 = 2000 * 1.0609 = 2121.80 zł", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'perc17', text: "Cena brutto produktu z 8% VAT wynosi 108 zł. Jaka jest cena netto?", answer: "100 zł (108 / 1.08)", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc18', text: "O ile procent liczba 80 jest większa od liczby 50?", answer: "60% ((80-50)/50 * 100%)", schoolLevel: 'podstawowa_7_8', difficulty: 'trudne' },
            { id: 'perc19', text: "Zamień 1.5 promila na procent.", answer: "0.15%", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'perc20', text: "Stopa bezrobocia spadła z 10% do 8%. O ile punktów procentowych spadła?", answer: "O 2 punkty procentowe.", schoolLevel: 'liceum_podst', difficulty: 'latwe' }
        ]
    },
    {
        id: 'analytic_geometry',
        name: 'Geometria Analityczna',
        questions: [
            { id: 'ageo1', text: "Podaj wzór na odległość dwóch punktów A=(x1,y1) i B=(x2,y2) w układzie współrzędnych.", answer: "sqrt((x2-x1)^2 + (y2-y1)^2)", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo2', text: "Podaj wzór na współrzędne środka odcinka AB, gdzie A=(x1,y1) i B=(x2,y2).", answer: "((x1+x2)/2, (y1+y2)/2)", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo3', text: "Jaki jest warunek prostopadłości dwóch prostych o współczynnikach kierunkowych a1 i a2?", answer: "a1 * a2 = -1", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo4', text: "Jaki jest warunek równoległości dwóch prostych o współczynnikach kierunkowych a1 i a2?", answer: "a1 = a2", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo5', text: "Napisz równanie okręgu o środku S=(0,0) i promieniu r=3.", answer: "x^2 + y^2 = 9", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo6', text: "Napisz równanie prostej przechodzącej przez punkty A=(1,2) i B=(3,6).", answer: "y = 2x", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo7', text: "Czy punkt P=(2,3) leży na prostej y = x + 1?", answer: "Tak", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo8', text: "Znajdź równanie prostej równoległej do y = 2x - 1 i przechodzącej przez P=(1,1).", answer: "y = 2x - 1", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo9', text: "Znajdź równanie prostej prostopadłej do y = 2x - 1 i przechodzącej przez P=(2,0).", answer: "y = -1/2 x + 1", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'ageo10', text: "Oblicz odległość punktu P=(1,1) od prostej x - y + 2 = 0.", answer: "sqrt(2)", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'ageo11', text: "Jaki jest środek i promień okręgu (x-1)^2 + (y+2)^2 = 16?", answer: "S=(1,-2), r=4", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo12', text: "Co to jest wektor? Podaj przykład.", answer: "Wielkość posiadająca kierunek, zwrot i wartość (długość), np. [3,4]", schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'ageo13', text: "Oblicz iloczyn skalarny wektorów u=[1,2] i v=[3,-1].", answer: "1*3 + 2*(-1) = 1", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'ageo14', text: "Jaki jest warunek prostopadłości dwóch niezerowych wektorów (iloczyn skalarny)?", answer: "Ich iloczyn skalarny wynosi 0.", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'ageo15', text: "Podaj równanie parametryczne prostej przechodzącej przez P=(1,0) i równoległej do wektora v=[2,3].", answer: "x = 1 + 2t, y = 3t", schoolLevel: 'liceum_rozsz', difficulty: 'trudne' },
            { id: 'ageo16', text: "Oblicz długość wektora u = [-3, 4].", answer: 5, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo17', text: "Napisz równanie ogólne prostej y = 2x - 3.", answer: "2x - y - 3 = 0", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'ageo18', text: "Czy proste 2x + y - 1 = 0 oraz 4x + 2y + 5 = 0 są równoległe?", answer: "Tak (współczynniki A,B są proporcjonalne, A1/A2 = B1/B2)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo19', text: "Znajdź punkt przecięcia prostych y = x + 1 oraz y = -x + 3.", answer: "(1, 2)", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ageo20', text: "Jaki jest obraz punktu P=(2, -1) w symetrii względem osi OX?", answer: "(2, 1)", schoolLevel: 'liceum_podst', difficulty: 'latwe' }
        ]
    },
    {
        id: 'descriptive_statistics',
        name: 'Statystyka Opisowa',
        questions: [
            { id: 'stat1', text: "Dla zestawu danych: 2, 4, 4, 5, 7, 9, oblicz średnią arytmetyczną.", answer: 5.166, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat2', text: "Dla zestawu danych: 2, 4, 4, 5, 7, 9, znajdź medianę.", answer: 4.5, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat3', text: "Dla zestawu danych: 1, 2, 2, 3, 4, 4, 4, 5, znajdź dominantę (modę).", answer: 4, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat4', text: "Oblicz wariancję dla danych: 2, 4, 6. (Średnia = 4)", answer: "((2-4)^2 + (4-4)^2 + (6-4)^2)/3 = (4+0+4)/3 = 8/3", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'stat5', text: "Oblicz odchylenie standardowe dla danych: 2, 4, 6. (Wariancja = 8/3)", answer: "sqrt(8/3)", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'stat6', text: "Co to jest rozstęp w zestawie danych?", answer: "Różnica między największą a najmniejszą wartością w zestawie.", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat7', text: "Dla danych: 10, 20, 30, 40, 50, oblicz rozstęp.", answer: 40, schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat8', text: "Jak nazywa się wykres przedstawiający dane za pomocą prostokątów, których wysokość jest proporcjonalna do częstości?", answer: "Histogram (lub diagram słupkowy)", schoolLevel: 'liceum_podst', difficulty: 'latwe' },
            { id: 'stat9', text: "W klasie jest 10 chłopców o średnim wzroście 170cm i 15 dziewcząt o średnim wzroście 160cm. Jaki jest średni wzrost wszystkich uczniów?", answer: "((10*170) + (15*160)) / 25 = (1700 + 2400) / 25 = 4100 / 25 = 164 cm", schoolLevel: 'podstawowa_7_8', difficulty: 'trudne' },
            { id: 'stat10', text: "Co to jest kwartyl dolny (Q1)?", answer: "Wartość, poniżej której znajduje się 25% danych (mediana pierwszej połowy danych).", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'stat11', text: "Co to jest kwartyl górny (Q3)?", answer: "Wartość, poniżej której znajduje się 75% danych (mediana drugiej połowy danych).", schoolLevel: 'liceum_rozsz', difficulty: 'srednie' },
            { id: 'stat12', text: "Oblicz rozstęp międzykwartylowy (IQR) jeśli Q1=20 i Q3=50.", answer: 30, schoolLevel: 'liceum_rozsz', difficulty: 'latwe' },
            { id: 'stat13', text: "Jakie są miary tendencji centralnej?", answer: "Średnia arytmetyczna, mediana, dominanta (moda).", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'stat14', text: "Jakie są miary rozproszenia (zmienności)?", answer: "Wariancja, odchylenie standardowe, rozstęp, rozstęp międzykwartylowy.", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'stat15', text: "Jeśli wszystkie wartości w zbiorze danych są takie same, ile wynosi odchylenie standardowe?", answer: 0, schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' }
        ]
    },
    {
        id: 'number_theory_basics',
        name: 'Teoria Liczb (Podstawy)',
        questions: [
            { id: 'ntb1', text: "Czy liczba 17 jest liczbą pierwszą?", answer: "Tak", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'ntb2', text: "Podaj wszystkie dzielniki liczby 12.", answer: "1, 2, 3, 4, 6, 12", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'ntb3', text: "Oblicz NWD(18, 24) (Największy Wspólny Dzielnik).", answer: 6, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'ntb4', text: "Oblicz NWW(6, 8) (Najmniejsza Wspólna Wielokrotność).", answer: 24, schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'ntb5', text: "Jaka jest reszta z dzielenia 17 przez 5?", answer: 2, schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'ntb6', text: "Co to jest liczba złożona? Podaj przykład.", answer: "Liczba naturalna większa od 1, która nie jest liczbą pierwszą (ma więcej niż dwa dzielniki), np. 4, 6, 9.", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'ntb7', text: "Rozłóż liczbę 36 на czynniki pierwsze.", answer: "2 * 2 * 3 * 3 (lub 2^2 * 3^2)", schoolLevel: 'podstawowa_7_8', difficulty: 'srednie' },
            { id: 'ntb8', text: "Czy liczba 0 jest liczbą naturalną?", answer: "Zależy od definicji (czasem tak, czasem nie - w Polsce częściej nie w szkole podstawowej/średniej). Dla bezpieczeństwa: W niektórych definicjach tak, w innych nie.", schoolLevel: 'podstawowa_4_6', difficulty: 'srednie' },
            { id: 'ntb9', text: "Podaj przykład liczby doskonałej.", answer: "6 (bo 1+2+3=6), 28 (bo 1+2+4+7+14=28)", schoolLevel: 'liceum_podst', difficulty: 'trudne' },
            { id: 'ntb10', text: "Co to są liczby względnie pierwsze? Podaj przykład pary.", answer: "Liczby, których NWD wynosi 1, np. (8, 9).", schoolLevel: 'liceum_podst', difficulty: 'srednie' },
            { id: 'ntb11', text: "Jaka jest cecha podzielności liczby przez 3?", answer: "Suma cyfr liczby jest podzielna przez 3.", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'ntb12', text: "Jaka jest cecha podzielności liczby przez 9?", answer: "Suma cyfr liczby jest podzielna przez 9.", schoolLevel: 'podstawowa_4_6', difficulty: 'latwe' },
            { id: 'ntb13', text: "Jaka jest cecha podzielności liczby przez 4?", answer: "Liczba utworzona przez dwie ostatnie cyfry jest podzielna przez 4.", schoolLevel: 'podstawowa_4_6', difficulty: 'srednie' },
            { id: 'ntb14', text: "Czy każda liczba pierwsza (oprócz 2) jest nieparzysta?", answer: "Tak", schoolLevel: 'podstawowa_7_8', difficulty: 'latwe' },
            { id: 'ntb15', text: "Co to jest sito Eratostenesa?", answer: "Algorytm do znajdowania liczb pierwszych z zadanego przedziału.", schoolLevel: 'liceum_podst', difficulty: 'srednie' }
        ]
    }
];

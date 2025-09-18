// Type definitions
interface Book {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  language?: string[];
  subject?: string[];
  ebook_access?: string;
}

interface SearchResponse {
  numFound: number;
  docs: Book[];
}

// Store current search results for filtering
let currentBooks: Book[] = [];
let currentQuery = '';

// Search books from OpenLibrary API
const searchBooks = async (query: string): Promise<Book[]> => {
  const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: SearchResponse = await response.json();
    return data.docs;
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
};

// Filter and transform book data
const processBooks = (
  books: Book[],
  filters: { available?: boolean },
) => {
  return books
    .filter((book) => {
      // Filter by availability if asked
      if (filters.available !== undefined) {
        const isAvailable = ["borrowable", "public"].includes(
          book.ebook_access || "",
        );
        if (filters.available !== isAvailable) return false;
      }

      return true;
    })
    .map((book) => ({
      title: book.title || "Untitled",
      authors: book.author_name?.slice(0, 2).join(", ") || "Unknown Author",
      year: book.first_publish_year || "Unknown",
      languages: book.language?.slice(0, 2) || [],
      subjects: book.subject?.slice(0, 3) || [],
      isAvailable: ["borrowable", "public"].includes(book.ebook_access || ""),
    }));
};

// Create individual book card from template
const createBookBox = (book: ReturnType<typeof processBooks>[0]) => {
  const template = document.getElementById(
    "bookCardTemplate",
  ) as HTMLTemplateElement;
  const bookCard = template.content.cloneNode(true) as DocumentFragment;

  // Get template elements
  const titleElement = bookCard.querySelector(".book-title") as HTMLElement;
  const authorElement = bookCard.querySelector(".book-author") as HTMLElement;
  const yearElement = bookCard.querySelector(".year") as HTMLElement;
  const availabilityElement = bookCard.querySelector(
    ".availability",
  ) as HTMLElement;
  const languageTagsContainer = bookCard.querySelector(
    ".language-tags",
  ) as HTMLElement;
  const subjectsSection = bookCard.querySelector(
    ".subjects-section",
  ) as HTMLElement;

  // Populate with book data
  titleElement.textContent = book.title;
  authorElement.textContent = `by ${book.authors}`;
  yearElement.textContent = `Year: ${book.year}`;

  // Set availability status
  availabilityElement.textContent = book.isAvailable
    ? "Available"
    : "Checked Out";
  availabilityElement.className = `availability ${book.isAvailable ? "available" : "unavailable"}`;

  // Add language tags
  book.languages.forEach((lang) => {
    const languageTag = document.createElement("span");
    languageTag.className = "language-tag";
    languageTag.textContent = lang.toUpperCase();
    languageTagsContainer.appendChild(languageTag);
  });

  // Show if available
  if (book.subjects.length > 0) {
    subjectsSection.style.display = "block";
    subjectsSection.textContent = `Subjects: ${book.subjects.join(", ")}`;
  }

  return bookCard.firstElementChild as HTMLElement;
};

// Display search results in the Application
const displayResults = (
  books: ReturnType<typeof processBooks>,
  searchQuery: string,
) => {
  const resultsSection = document.getElementById("resultsSection")!;
  const resultsCount = document.getElementById("resultsCount")!;
  const bookGrid = document.getElementById("bookGrid")!;
  const noResults = document.getElementById("noResults")!;

  resultsSection.style.display = "block";

  if (books.length === 0) {
    resultsCount.textContent = "0 books found";
    bookGrid.style.display = "none";
    noResults.style.display = "block";
    return;
  }

  resultsCount.textContent = `${books.length} books found for "${searchQuery}"`;
  noResults.style.display = "none";
  bookGrid.style.display = "grid";

  // Clear previous results 
  bookGrid.innerHTML = "";
  books.forEach((book) => {
    const bookCard = createBookBox(book);
    bookGrid.appendChild(bookCard);
  });
};

// Handle search button click
const handleSearch = async () => {
  const searchInput = document.getElementById(
    "searchInput",
  ) as HTMLInputElement;
  const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
  const availabilityFilter = document.getElementById(
    "availabilityFilter",
  ) as HTMLSelectElement;

  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  // Show loading state
  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    // Fetch raw book data from API
    const rawBooks = await searchBooks(query);

    // Store results for filtering
    currentBooks = rawBooks;
    currentQuery = query;

    // Apply filters and transform data
    const processedBooks = processBooks(rawBooks, {
      available: availabilityFilter.value === "available" ? true : undefined,
    });

    // Display the results
    displayResults(processedBooks, query);

  } catch (error) {
    // Error handling
    console.error("Search failed:", error);
    alert("Search failed. Please try again.");

  } finally {
    // Reset button state regardless of success/failure
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
};

// Initialize event listeners when page loads
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput") as HTMLInputElement;
  const availabilityFilter = document.getElementById("availabilityFilter") as HTMLSelectElement;

  // Search button click
  searchBtn?.addEventListener("click", handleSearch);

  // Enter key in search input
  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Clear results when search input is cleared
  searchInput?.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      const resultsSection = document.getElementById("resultsSection")!;
      resultsSection.style.display = "none";
      currentBooks = [];
      currentQuery = '';
    }
  });

  // Availability filter 
  availabilityFilter?.addEventListener("change", () => {
    if (currentBooks.length > 0) {
      const processedBooks = processBooks(currentBooks, {
        available: availabilityFilter.value === "available" ? true : undefined,
      });
      displayResults(processedBooks, currentQuery);
    }
  });
});
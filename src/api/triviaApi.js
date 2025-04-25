const API_URL = 'https://opentdb.com/api.php';

/**
 * Fetches trivia questions from the Open Trivia Database API.
 *
 * @param {object} params - Parameters for the API call.
 * @param {number} [params.amount=10] - The number of questions to fetch.
 * @param {number} [params.category] - The category ID.
 * @param {string} [params.difficulty] - The difficulty ('easy', 'medium', 'hard').
 * @param {string} [params.type] - The type of question ('multiple', 'boolean').
 * @returns {Promise<object>} A promise that resolves to the API response object.
 */
export const fetchTriviaQuestions = async ({ amount = 10, category, difficulty, type } = {}) => {
  const params = new URLSearchParams({ amount });

  if (category) params.append('category', category);
  if (difficulty) params.append('difficulty', difficulty);
  if (type) params.append('type', type);
  // Consider adding 'encode=url3986' or 'base64' if you encounter character issues
  // params.append('encode', 'url3986');

  const url = `${API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Check the API's internal response code
    if (data.response_code !== 0) {
      // Handle API-specific errors (e.g., no results, invalid parameter)
      // You might want to map response_code to more user-friendly messages
      console.error('API Error:', data.response_code);
      // Depending on the error, you might return an empty array or throw a specific error
      // For now, let's return the raw data including the error code
      return data;
    }

    return data; // Contains { response_code: 0, results: [...] }
  } catch (error) {
    console.error("Could not fetch trivia questions:", error);
    // Re-throw the error or return a default error structure
    throw error; // Or return { response_code: -1, results: [] };
  }
};

/**
 * Fetches the list of trivia categories from the API.
 * @returns {Promise<Array<{id: number, name: string}>>} A promise that resolves to an array of category objects.
 */
export const fetchCategories = async () => {
  const CATEGORY_URL = 'https://opentdb.com/api_category.php';
  try {
    const response = await fetch(CATEGORY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // La API devuelve { trivia_categories: [...] }
    return data.trivia_categories || [];
  } catch (error) {
    console.error("Could not fetch categories:", error);
    throw error; // O return [];
  }
};

// Example usage (optional, for testing):
// fetchTriviaQuestions({ amount: 5, category: 9, difficulty: 'easy', type: 'multiple' })
//   .then(data => console.log(data))
//   .catch(error => console.error(error));

// Example usage (optional, for testing):
// fetchCategories()
//   .then(categories => console.log(categories))
//   .catch(error => console.error(error)); 
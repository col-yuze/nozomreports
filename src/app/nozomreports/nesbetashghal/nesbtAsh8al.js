
const fetchData = async () => {
  try {
    const response = await fetch("/api/nesba");
    const data = response.json();
    return data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default fetchData
export const createUrlEntry = async (url: string): Promise<string> => {
  try {
    const response = await fetch("/api/urlentry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });
  

    const data = await response.json();
  
    if (response.status !== 200) {
      throw new Error(data.error);
    }

    return data.urlEntry;
  } catch (e: any) {
    throw new Error(e)
  }
}
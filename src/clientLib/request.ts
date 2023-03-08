import type { SessionUser } from "@/interfaces/request"
import type { UrlEntryClientData } from "@/interfaces/request"

export const createUrlEntryApi = async (url: string): Promise<string> => {
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

export const checkSessionApi = async (): Promise<SessionUser> => {
  try {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  
    const data = await response.json();
  
    if (response.status !== 200) {
      throw new Error(data.error);
    }

    return data;
  } catch (e: any) {
    throw new Error(e)
  }
}

export const loginUserApi = async(email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.status !== 200) {
      throw new Error("invalid email or password");
    }

    return true;
  } catch (e: any) {
    throw new Error(e)
  }
}

export const signUpUserApi = async(email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.status !== 200) {
      throw new Error("invalid email or password");
    }

    return true;
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getUserUrlEntryApi = async(): Promise<any> => {
  try {
    const response = await fetch("/api/urlentry", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.status !== 200) {
      throw new Error("invalid email or password");
    }

    const data = await response.json();
    return data.urlEntries;
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateUrlEntryApi = async(entryData: UrlEntryClientData): Promise<any> => {
  try {
    const url = `/api/urlentry/${entryData.hashKey}`
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    });
    
    if (response.status !== 200) {
      throw new Error("fail to update url entry");
    }

    const urlEntries = await response.json();
    return urlEntries;
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteUrlEntryApi = async(hashKey: string): Promise<any> => {
  try {
    const url = `/api/urlentry/${hashKey}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    });
    
    if (response.status !== 200) {
      throw new Error("fail to delete url entry");
    }

    return true;
  } catch (e: any) {
    throw new Error(e)
  }
}
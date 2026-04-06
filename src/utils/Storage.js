const STORAGE_KEY = 'dialbot_conversations';



export function loadConversations(){

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e){
        console.error('Error loading conversations:',e);
        return[];
            
    }
}
    
export function saveConversations(conversations){
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e){
       console.error('Error saving conversations:',e); 
    }
}


export function generateId(){
    return Math.random().toString(36).substring(2,11);
}
  

export function clearAllConversations(){
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e){
        console.error('Error clearing conversations', e);
    }
}


export function importConversations(jsonString){
   try {
    const data = JSON.parse(jsonString);
    if (Array.isArray(data)){
        localStorage.setItem(STORAGE_KEY, jsonString);
        return true;
    }
    return false;
   } catch (e){
    console.error('Error importing conversations:', e);
    return false;
   }
}

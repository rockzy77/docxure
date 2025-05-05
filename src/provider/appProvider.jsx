import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {


    
  

    const [user, setUser] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [backupDocuments, setBackupDocuments] = useState([]);


    return <AppContext.Provider value={{
        user, setUser, documents, setDocuments, backupDocuments, setBackupDocuments
    }}>
        {children}
    </AppContext.Provider>
}


export { AppContext, AppProvider };
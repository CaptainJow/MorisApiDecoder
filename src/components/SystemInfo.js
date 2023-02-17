import React, { useState, useEffect } from 'react';
import api from '../api/post';

// morse-code-converter kullanarak yaptim
const morse = require("morse-code-converter");

const SystemInfo = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState('CPU');

  const handleCommandChange = (event) => {
    setSelectedCommand(event.target.value);
  };

//morse haline dönüş sağlıyordur
  const convertToMorse = (command) => {
    return morse.textToMorse(command);
  };

//bu işlev "data" içinde bir nesneyle karşılaşması durumunda işlevi geri çağırmak için recurtion kullanır .
// ve bunu kullanarak Morseden normal texte dönüş yapıyorum
  const decodeFromMorse = (response) => {
    const decodedResponse = {};
    for (const [key, value] of Object.entries(response)) {
      if (typeof value === 'string') {
        decodedResponse[key] = morse.morseToText(value);
      } else if (typeof value === 'object') {
        decodedResponse[key] = decodeFromMorse(value);
      } else {
        decodedResponse[key] = value;
      }
    }
    return decodedResponse;
  };


  useEffect(() => {
    const MorseData = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('', {
          command: convertToMorse(selectedCommand),
          checksum: '-'
        });
        setData(response.data);
        setIsLoading(false);
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    };

    MorseData();

  }, [selectedCommand]);
// kullanılacak işlemler
  const commands = ['CPU','ARCH', 'FREEMEM', 'HOSTNAME', 'PLATFORM', 'TOTALMEM', 'TYPE', 'UPTIME'];

  return (
    <>
    
      <div >
      <h2>Istediğiniz POST metodu seçin ve dönüşmüş halini görün</h2>
      
        <select value={selectedCommand} onChange={handleCommandChange}>
          {commands.map((command) => (
            <option key={command} value={command}>{command}</option>
          ))}
        </select>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <pre>{JSON.stringify(decodeFromMorse(data), null, 2)}</pre>
        )}
        <h3>NOT....dönüşmemiş versiyonu consoleden kontrol edin</h3>
      </div>
    </>
  );
};

export default SystemInfo;

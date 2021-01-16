import React, { useEffect, useState } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

const App = () => {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    setReady(false);
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/fig' }),
    );

    setGif(url);
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  return ready ? (
    <div className="App">
      {video && (
        <video controls width="250" src={URL.createObjectURL(video)}></video>
      )}

      {!ready && <p>Loading...</p>}

      {video && <p>動画ファイルを洗濯してください（mp4）</p>}

      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      {video && <button onClick={convertToGif}>Convert to GIF</button>}
      {ready && gif && <img src={gif} alt="" width="250" />}
    </div>
  ) : (
    <div className="App">
      <p>変換中...</p>
    </div>
  );
};

export default App;

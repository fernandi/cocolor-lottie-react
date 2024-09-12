import React, { useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from './animation.json'; // Ton fichier Lottie JSON

function App() {
  const [isPlaying, setIsPlaying] = useState(false); // Gérer l'état de lecture de l'animation
  const [modifiedAnimationData, setModifiedAnimationData] = useState(animationData);
  const audioRef = useRef(null); // Référence pour l'audio
  const lottieRef = useRef(null); // Référence pour le composant Lottie

  // Fonction récursive pour parcourir les shapes et remplacer les couleurs
  const replaceColorsInShapes = (shapes, colorMap) => {
    shapes.forEach((shape) => {
      if (shape.ty === 'gr') {
        // Si le shape est un groupe, on doit parcourir ses contenus
        replaceColorsInShapes(shape.it, colorMap); // 'it' contient les sous-formes
      } else if (shape.ty === 'fl' && shape.c && shape.c.k) {
        // Si c'est un remplissage, on remplace la couleur
        const originalColor = shape.c.k;
        const replacementColor = colorMap[originalColor.toString()];
        if (replacementColor) {
          shape.c.k = replacementColor;
        }
      }
    });
  };

  // Fonction pour remplacer les couleurs dans toutes les layers
  const replaceColors = (colorMap) => {
    const newAnimationData = { ...animationData };

    // Parcours les layers pour modifier les couleurs
    newAnimationData.layers.forEach((layer) => {
      if (layer.shapes) {
        replaceColorsInShapes(layer.shapes, colorMap);
      }
    });

    // Met à jour l'animation avec les nouvelles couleurs
    setModifiedAnimationData(newAnimationData);
  };

  // Fonction pour jouer l'animation et l'audio
  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);

      // Démarrer l'audio
      if (audioRef.current) {
        audioRef.current.play();
      }

      // Démarrer l'animation
      if (lottieRef.current) {
        lottieRef.current.play();
      }
    }
  };

  // Remplacer les couleurs une fois au chargement
  React.useEffect(() => {
    const colorMap = {
      '1,0.9529,0.2902': [0, 0, 0],           // Fond -> Noir
      '0.5294,0.5294,0.5294': [0, 0, 1],      // Bonhomme -> Bleu
      '0.9412,0.702,0.3412': [1, 0, 1],       // Route -> Magenta
      '0.8667,0.3137,0.2549': [1, 1, 0],      // Côtés -> Jaune
      '0,0.6667,0.9137': [0, 1, 1],           // Montagne 1 -> Cyan
      '0.851,0.1765,0.5412': [0, 1, 0],       // Motagne 2 -> Vert
      '0.2431,0.5686,0.302': [0, 0, 0],       // Motagne 3 -> Noir
      '0.6863,0.1882,0.2039': [0, 0, 0],      // Montagne 4 -> Noir
    };

    replaceColors(colorMap); // Remplacer les couleurs avant de lancer l'animation
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Animation avec audio synchronisé</h1>

        {/* Composant Lottie avec contrôle */}
        <Lottie 
          animationData={modifiedAnimationData} 
          loop={false} // Ne pas boucler l'animation
          autoplay={false} // Ne pas jouer automatiquement
          lottieRef={lottieRef} // Référence pour contrôler l'animation
          onComplete={() => setIsPlaying(false)} // Reset isPlaying à la fin
          style={{ height: 500, width: 500 }} 
        />

        {/* Bouton pour lancer l'animation et l'audio */}
        <button onClick={handlePlay} disabled={isPlaying}>
          {isPlaying ? 'Lecture en cours...' : 'Lancer l\'animation'}
        </button>

        {/* Élément audio */}
        <audio ref={audioRef} src="/audio.mp3" onEnded={() => setIsPlaying(false)} />
      </header>
    </div>
  );
}

export default App;
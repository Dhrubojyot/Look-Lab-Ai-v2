import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { TryOnResult } from './components/TryOnResult';
import { Loader } from './components/Loader';
import { generateTryOnImage } from './services/geminiService';
import { ClothingType, OutfitItem } from './types';
import { SwapIcon } from './components/icons/SwapIcon';
import { GithubIcon } from './components/icons/GithubIcon';
import { WebsiteIcon } from './components/icons/WebsiteIcon';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { InstagramIcon } from './components/icons/InstagramIcon';


const App: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (type: ClothingType | 'user', base64: string) => {
    if (type === 'user') {
      setUserImage(base64);
    } else {
      setOutfitItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.type === type);
        if (existingItemIndex > -1) {
          const newItems = [...prev];
          newItems[existingItemIndex] = { type, data: base64 };
          return newItems;
        }
        return [...prev, { type, data: base64 }];
      });
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!userImage || outfitItems.length === 0) {
      setError('Please upload your photo and at least one clothing item.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateTryOnImage(userImage, outfitItems);
      if (result) {
        setGeneratedImage(result);
      } else {
        setError('The AI could not generate an image. Please try a different set of images.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userImage, outfitItems]);

  const canGenerate = userImage && outfitItems.length > 0 && !isLoading;

  return (
    <div className="min-h-screen font-sans text-gray-800 flex flex-col">
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary">Look Lab AI ✨</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Add your photo and mix & match outfits to discover your fresh look instantly.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Create Your Look 😄</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader
                label="Your Photo"
                description="UPLOAD A CLEAR, FULL-BODY PHOTO."
                onImageUpload={(base64) => handleImageUpload('user', base64)}
              />
              <ImageUploader
                label="Top"
                description="E.G., SHIRT, T-SHIRT, JACKET"
                onImageUpload={(base64) => handleImageUpload(ClothingType.TOP, base64)}
              />
               <ImageUploader
                label="Bottom"
                description="E.G., PANTS, SKIRT, JEANS"
                onImageUpload={(base64) => handleImageUpload(ClothingType.BOTTOM, base64)}
              />
                <ImageUploader
                label="Shoes / Accessory"
                description="E.G., SNEAKERS, HAT, BAG"
                onImageUpload={(base64) => handleImageUpload(ClothingType.ACCESSORY, base64)}
              />
            </div>
             <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`w-auto inline-flex items-center justify-center px-12 py-3 text-base font-semibold rounded-lg ${
                  canGenerate
                    ? 'bg-slate-600 text-white shadow-md transform transition-all duration-300 ease-in-out hover:bg-gradient-to-r from-green-500 to-primary hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                <SwapIcon className="w-5 h-5 mr-3" />
                Generate Look
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg min-h-[400px] flex flex-col justify-center items-center border border-white">
             <h2 className="text-2xl font-bold mb-6 text-center text-primary">The Result 🔥</h2>
            {isLoading && <Loader />}
            {error && <p className="text-red-600 bg-red-50 p-4 rounded-md">{error}</p>}
            {!isLoading && !error && generatedImage && userImage && (
              <TryOnResult originalImage={userImage} generatedImage={generatedImage} />
            )}
            {!isLoading && !error && !generatedImage && (
                 <div className="text-center text-gray-500">
                    <p className="text-lg">Your AI-generated look will show up here 👕</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-gray-500 text-sm">
        <p className="mb-2">Created with ❤️ by Dhrubojyoti Chakraborty © 2025</p>
        <div className="flex justify-center items-center space-x-4">
            <a href="https://github.com/Dhrubojyot" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><GithubIcon className="w-5 h-5" /></a>
            <a href="https://dhrubojyotidev.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><WebsiteIcon className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/in/dhrubojyoti-chakraborty-567857257/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><LinkedInIcon className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/i_am_dhrubojyoti_chakraborty/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><InstagramIcon className="w-5 h-5" /></a>
        </div>
      </footer>
    </div>
  );
};

export default App;
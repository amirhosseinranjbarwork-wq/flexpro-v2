import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Typewriter effect
interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  cursor = true,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, onComplete]);

  return (
    <span className={`${className} font-mono`}>
      {displayText}
      {cursor && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-blue-500"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

// Fade in text with stagger
interface FadeInTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  stagger = 0.1
}) => {
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: delay + (index * stagger)
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Letter by letter animation
interface LetterAnimationProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  variant?: 'bounce' | 'slide' | 'scale' | 'rotate';
}

export const LetterAnimation: React.FC<LetterAnimationProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.1,
  variant = 'bounce'
}) => {
  const letters = text.split('');

  const getVariant = (index: number) => {
    const baseDelay = delay + (index * stagger);

    switch (variant) {
      case 'bounce':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: baseDelay
          }
        };
      case 'slide':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: baseDelay }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            delay: baseDelay
          }
        };
      case 'rotate':
        return {
          initial: { opacity: 0, rotate: -180 },
          animate: { opacity: 1, rotate: 0 },
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: baseDelay
          }
        };
      default:
        return {};
    }
  };

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          {...getVariant(index)}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
};

// Wave text animation
export const WaveText: React.FC<{
  text: string;
  className?: string;
  speed?: number;
}> = ({ text, className = '', speed = 1 }) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 1 / speed,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Glitch text effect
export const GlitchText: React.FC<{
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}> = ({ text, className = '', intensity = 'medium' }) => {
  const getIntensity = () => {
    switch (intensity) {
      case 'low':
        return { duration: 4, repeatDelay: 8 };
      case 'medium':
        return { duration: 3, repeatDelay: 6 };
      case 'high':
        return { duration: 2, repeatDelay: 4 };
      default:
        return { duration: 3, repeatDelay: 6 };
    }
  };

  const { duration, repeatDelay } = getIntensity();

  return (
    <motion.span
      className={`${className} relative inline-block`}
      animate={{
        x: [0, -2, 2, -1, 1, 0],
        skewX: [0, -5, 5, -3, 3, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay
      }}
    >
      {text}
      <motion.span
        className="absolute inset-0 text-red-500 opacity-20"
        animate={{
          x: [0, 2, -2, 1, -1, 0],
          skewX: [0, 5, -5, 3, -3, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-blue-500 opacity-20"
        animate={{
          x: [0, -1, 1, -2, 2, 0],
          skewX: [0, -3, 3, -5, 5, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
};

// Rainbow text effect
export const RainbowText: React.FC<{
  text: string;
  className?: string;
  speed?: number;
}> = ({ text, className = '', speed = 1 }) => {
  const colors = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500'
  ];

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className={`inline-block ${colors[index % colors.length]}`}
          animate={{
            filter: [
              'hue-rotate(0deg)',
              'hue-rotate(360deg)',
              'hue-rotate(0deg)'
            ]
          }}
          transition={{
            duration: 3 / speed,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Gradient text animation
export const GradientText: React.FC<{
  text: string;
  className?: string;
  colors?: string[];
  speed?: number;
}> = ({
  text,
  className = '',
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'],
  speed = 1
}) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5 / speed,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [controls, speed]);

  return (
    <motion.span
      className={`${className} bg-gradient-to-r bg-clip-text text-transparent`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '200% 200%'
      }}
      animate={controls}
    >
      {text}
    </motion.span>
  );
};

// Scramble text effect
interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
  characters?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  duration = 2,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = () => {
    setIsAnimating(true);
    const originalText = text;
    let iterations = 0;
    const maxIterations = duration * 10;

    const interval = setInterval(() => {
      setDisplayText(originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('')
      );

      iterations += 1 / maxIterations;

      if (iterations >= 1) {
        clearInterval(interval);
        setDisplayText(originalText);
        setIsAnimating(false);
      }
    }, duration * 100);
  };

  useEffect(() => {
    scramble();
  }, [text]);

  return (
    <motion.span
      className={`${className} font-mono`}
      animate={isAnimating ? { opacity: [1, 0.8, 1] } : {}}
      transition={{ duration: 0.1, repeat: isAnimating ? Infinity : 0 }}
    >
      {displayText}
    </motion.span>
  );
};

// Morphing text effect
interface MorphingTextProps {
  texts: string[];
  className?: string;
  duration?: number;
}

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className = '',
  duration = 3
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [texts.length, duration]);

  return (
    <motion.span
      key={currentIndex}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {texts[currentIndex]}
    </motion.span>
  );
};

export default Typewriter;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { message } from "../../interfaces/interfaces";
import { MessageActions } from '@/components/custom/actions';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp Icon


export const PreviewMessage = ({ message }: { message: any }) => {
  const [showOverview, setShowOverview] = useState<boolean>(false);

  if (!message.content || typeof message.content !== 'object') {
    return  (
      <motion.div
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cx(
            'group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted group-data-[role=user]/message:text-white flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl'
          )}
        >
          {message.role === 'assistant' && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
              <SparklesIcon size={14} />
            </div>
          )}
  
          <div className="flex flex-col w-full">
            {message.content && (
              <div className="flex flex-col gap-4 text-left">
                <Markdown>{message.content}</Markdown>
              </div>
            )}
  
            {message.role === 'assistant' && (
              <MessageActions message={message} />
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  

  const { 
    name, 
    age, 
    gender, 
    profession_area, 
    hourly_price, 
    rating, 
    experience_level, 
    location, 
    photo_url, 
    available_online, 
    languages, 
    other_details 
  } = message.content;

  const whatsappMessage = `Hi ${name}, I am interested in learning ${profession_area}. Could you please share more details?`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=905318875243&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div 
        className={cx(
          'group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted flex gap-4 p-4 w-full rounded-xl hover:shadow-md transition-shadow'
        )}
      >
        <img 
          src={photo_url} 
          alt={name} 
          className="w-24 h-24 object-cover rounded-full"
        />
        <div className="flex flex-col w-full">
          <h3 className="font-bold text-lg">{name}</h3>
          <p>👤 Age: {age} | Gender: {gender}</p>
          <p>📚 Profession: {profession_area}</p>
          <p>💲 Hourly Price: ${hourly_price} | ⭐ Rating: {rating}</p>
          <p>📍 Location: {location} | 🌐 Online: {available_online ? 'Yes' : 'No'}</p>
          <p>🗣️ Languages: {languages.join(', ')}</p>
          <p>🎓 Experience Level: {experience_level}</p>
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-3 flex items-center gap-2 text-green-600 hover:underline text-sm font-semibold"
          >
            <FaWhatsapp size={18} /> Contact on WhatsApp
          </a>

          <button 
            onClick={() => setShowOverview(!showOverview)} 
            className="mt-2 text-blue-600 hover:underline"
          >
            {showOverview ? 'Hide Details' : 'Show Details'}
          </button>

          <AnimatePresence>
            {showOverview && (
              <motion.p 
                className="text-sm mt-2" 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
              >
                {other_details}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};


export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          'group-data-[role=user]/message:bg-muted'
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>
      </div>
    </motion.div>
  );
};

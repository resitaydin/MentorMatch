import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa'; // Graduation cap icon from FontAwesome
import { MdMessage } from 'react-icons/md'; // Chat message icon from Material Design
import { GiTeacher } from 'react-icons/gi'; // Teacher icon from Grommet Icons

export const Overview = () => {
  return (
    <>
      <motion.div
        key="overview"
        className="max-w-3xl mx-auto md:mt-20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.75 }}
      >
        <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
          <p className="flex flex-row justify-center gap-4 items-center">
            <FaGraduationCap size={44} /> {/* Graduation cap icon */}
            <span>+</span>
            <MdMessage size={44} /> {/* Chat message icon */}
            <span>+</span>
            <GiTeacher size={44} /> {/* Teacher icon */}
          </p>
          <p className='text-lg mt-3'> 
            Welcome to <strong>MentorMatch</strong><br />
            your personal mentor assistant.<br />
            Find mentor recommendations, reviews, and more!
          </p>
        </div>
      </motion.div>
    </>
  );
};

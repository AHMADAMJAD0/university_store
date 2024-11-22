import React, { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CategorySection = forwardRef((props, ref) => {
  const controls = useAnimation();
  const [inViewRef, inView] = useInView({
    triggerOnce: false, // Keep listening for intersection changes
    threshold: 0.2,     // Trigger when 20% of the section is visible
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden'); // Reset animation when out of view
    }
  }, [inView, controls]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.section
      ref={node => {
        ref && (ref.current = node); // Forward ref for external usage
        inViewRef(node);             // Attach Intersection Observer ref
      }}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
    >
      <motion.h1
        className="c_text flex justify-center mt-14 font-bold font-custom"
        style={{ fontSize: '2.75rem', fontFamily: 'kanit' }}
        variants={itemVariants}
      >
        Explore Categories
      </motion.h1>
      <motion.div
        className="category grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-16 py-10 mb-24"
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants}>
          <Link to="/bachelors" className="box py-10 text-center rounded-md">
            <img src="/bachelors.png" alt="Women" className="mx-auto mb-4" />
            <h1 className="cat_h1 pt-4">Graduation Suits For Bachelors</h1>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/masters" className="box py-10 text-center rounded-md">
            <img src="/Masters.png" alt="Men" className="mx-auto mb-4" />
            <h1 className="cat_h1 pt-4">Graduation Suits For Masters</h1>
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/phd" className="box py-10 text-center rounded-md">
            <img src="/phd.png" alt="Accessories" className="mx-auto mb-4" />
            <h1 className="cat_h1 pt-4">Graduation Suits For PhD</h1>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
});

export default CategorySection;

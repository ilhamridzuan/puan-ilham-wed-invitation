const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/sections');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const newFadeUp = `const fadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 1.5, 
      delay, 
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace fadeUp definition
  const fadeUpRegex = /const fadeUp = {[\s\S]*?visible:[\s\S]*?transition: {[\s\S]*?},[\s\S]*?}\),[\s\S]*?};/g;
  if (fadeUpRegex.test(content)) {
    content = content.replace(fadeUpRegex, newFadeUp);
    changed = true;
  }

  // Replace inline transitions
  const transitionRegex1 = /transition={{ duration: [0-9.]+, ease: "easeOut" }}/g;
  if (transitionRegex1.test(content)) {
    content = content.replace(transitionRegex1, 'transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}');
    changed = true;
  }
  
  // Replace transition with delay in WishesSection
  const transitionRegex2 = /transition={{ duration: [0-9.]+, delay: (.*?), ease: "easeOut" }}/g;
  if (transitionRegex2.test(content)) {
    content = content.replace(transitionRegex2, 'transition={{ duration: 1.5, delay: $1, ease: [0.22, 1, 0.36, 1] }}');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

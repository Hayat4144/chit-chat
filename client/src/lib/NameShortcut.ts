const getNameshortcut = (name: string) => {
  const shortcut = name.split(' ').map(value=>value.slice(0,1)).join('').toUpperCase();
  return shortcut; 
};

export default getNameshortcut;

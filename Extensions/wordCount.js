module.exports = function (io, socket) {
    function countWords(code) {
      const words = code.split(/\s+/).filter((word) => word.length > 0);
      return words.length;
    }
  
    return {
      run: function (code) {
        const wordCount = countWords(code);
        io.emit('extension result', { name: 'wordCount', result: wordCount });
      },
    };
  };
  
  
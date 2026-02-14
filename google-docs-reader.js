class GoogleDocsReader {
    // Get all text
    async getAllText() {
      const canvas = document.querySelector('.kix-canvas-tile-content');
      if (canvas) canvas.click();
  
      await this.sleep(200);
      document.execCommand('selectAll', false, null);
      await this.sleep(100);
  
      const raw = window.getSelection().toString();
      window.getSelection().removeAllRanges();
  
      return this.cleanText(raw);
    } 
  
    //  Get selected text
    getSelectedText() {
      return window.getSelection().toString();
    } 
  
    // Get context
    async getContext(charsBefore = 100, charsAfter = 100) {
      const selected = this.getSelectedText();
      const fullText = await this.getAllText();
      
      if (selected && fullText.includes(selected)) {
        const index = fullText.indexOf(selected);
        return {
          before: fullText.slice(Math.max(0, index - charsBefore), index),
          selected: selected,
          after: fullText.slice(index + selected.length, Math.min(fullText.length, index + selected.length + charsAfter)),
          fullText: fullText
        };
      }
      
      return { fullText }; // Return object with fullText if nothing selected
    } 
  
    // Insert text
    insertText(text) {
      const editor = document.querySelector('.kix-appview-editor');
      editor.focus();
      document.execCommand('insertText', false, text);
    } 
    //  Replace selected text
    replaceSelectedText(newText) { 
      const editor = document.querySelector('.kix-appview-editor');
      editor.focus();
      document.execCommand('insertText', false, newText); // ← Use 'insertText', not 'replaceSelectedText'
    } 
  
    //clean texr
    cleanText(raw) {
      const junkTerms = [
        'Untitled document',
        'Banner hidden',
        'Selected',
        'new line',
        'space',
        'Screen reader support',
        'Turn on screen reader'
      ];
  
      const lines = raw.split('\n');
      const cleaned = lines.filter(line => {
        const t = line.trim();
        
        // Skip empty
        if (!t) return false;
        
        // Skip junk
        if (junkTerms.some(junk => t.includes(junk))) return false;
        
        // Skip single chars
        if (t.length === 1) return false;
        
        return true;
      });
      
      return cleaned.join('\n').trim();
    } 
  
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  } 
  
  // Make it available globally
  window.GoogleDocsReader = GoogleDocsReader;
import axios from "axios";

export class GeminiTool {
  private code: string;
  private editor?: any;
  private readOnly: boolean | undefined;
  private block: any;
  private config: any;

  constructor({ data, readOnly, block, config }: any) {
    this.code = data.code || "";
    this.readOnly = readOnly;
    this.block = block;
    this.config = config;
    console.log(config);
  }

  static get toolbox() {
    return {
      title: "AiAgent",
      icon: `<svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
          </linearGradient>
        </defs>
        
        <path
          d="M50 10
             C60 40, 60 40, 90 50
             C60 60, 60 60, 50 90
             C40 60, 40 60, 10 50
             C40 40, 40 40, 50 10"
          fill="url(#starGradient)"
        />
      </svg>`,
    };
  }

  static get isReadOnlySupported() {
    return false;
  }

  render() {
    const wrapper = document.createElement("div");

    const textarea = document.createElement("textarea");
    textarea.classList.add("w-full", "outline-none", "h-full");
    textarea.placeholder = "Type your prompt and press Enter...";
    textarea.value = this.code; // Set the initial value to the saved state


    // Handle input events to update the internal state
    textarea.addEventListener("input", (event) => {
      console.log((event.target as HTMLTextAreaElement).value);
      this.code = (event.target as HTMLTextAreaElement).value; // Persist text while typing
    });

    // Handle Enter key press
    textarea.addEventListener("keydown", async (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const prompt = textarea.value.trim();
        if (prompt) {
          // Disable textarea while fetching the response
          textarea.disabled = true;

          const response = await this.fetchGeminiResponse(prompt);
          if (response) {
            // this.updateEditorContent(response); // Update the editor content
            // textarea.value = response;
            // this.code = response; // Update the internal state
            console.log(response);
            this.config.setAgreement({
              content: JSON.stringify({
                time: 1737245451442,
                blocks: [
                  {
                    id: "_0thRwJODR",
                    type: "paragraph",
                    data: { text: response },
                  },
                ],
                version: "2.30.7",
              }),
            });
            // const p = document.createElement("p");
            // p.innerText = response;
            // wrapper.appendChild(p);
          }

          // Enable textarea again and retain the current text
          textarea.disabled = false;
        }
      }
    });

    wrapper.appendChild(textarea);
    return wrapper;
  }

  /**
   * Fetch response from Gemini API
   * @param {string} prompt - The prompt text
   * @returns {Promise<string>} - The API response
   */
  private async fetchGeminiResponse(prompt: string): Promise<string> {
    try {
      const userToken = JSON.parse(localStorage.getItem("usertoken") || "{}");
      const accessToken = userToken ? userToken.accessToken : null;

      return await axios
        .post(
          `http://localhost:5000/v1/ai/gaio`,
          {
            prompt,
            title: this.config?.agreement?.title,
            orgdetails: this.config?.organization?.data?.[0],
            customerDetails: this.config?.customer?.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((response) => {
          return response.data.data;
        });
    } catch (error) {
      console.error("Error fetching Gemini API:", error);
      return "Error fetching response.";
    }
  }

  /**
   * Update the editor content
   * @param {string} content - The new content to add
   */
  private updateEditorContent(content: string) {
    if (this.editor) {
      const transaction = this.editor.state.update({
        changes: { from: this.editor.state.doc.length, insert: `\n${content}` },
      });
      this.editor.dispatch(transaction);
    } else {
      this.code = content;
    }
  }

  save() {
    return {
      code: this.code, // Persist the current state when saving
    };
  }
}

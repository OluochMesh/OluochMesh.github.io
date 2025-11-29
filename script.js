/**
 * Meshack's Terminal Portfolio
 * Core Logic for Terminal Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    const terminal = new Terminal();
});

class Terminal {
    constructor() {
        this.input = document.getElementById('command-input');
        this.output = document.getElementById('terminal-output');
        this.history = [];
        this.historyIndex = -1;
        
        this.commands = {
            'help': {
                description: 'Show available commands',
                action: () => this.showHelp()
            },
            'whoami': {
                description: 'Display user information',
                action: () => this.showWhoAmI()
            },
            'education': {
                description: 'Show educational background',
                action: () => this.showEducation()
            },
            'projects': {
                description: 'List all projects',
                action: () => this.showProjects()
            },
            'skills': {
                description: 'Display technical skills',
                action: () => this.showSkills()
            },
            'contact': {
                description: 'Open contact information',
                action: () => this.showContact()
            },
            'clear': {
                description: 'Clear terminal output',
                action: () => this.clearTerminal()
            },
            'history': {
                description: 'Show command history',
                action: () => this.showHistory()
            }
        };

        // Aliases
        this.commands['ls'] = this.commands['projects'];
        this.commands['cat interests.txt'] = { description: 'List interests', action: () => this.showInterests() };
        this.commands['interests'] = this.commands['cat interests.txt'];
        this.commands['nano contact.txt'] = this.commands['contact'];
        this.commands['skills --list'] = this.commands['skills'];

        this.initEventListeners();
        this.focusInput();
        
        // Initial greeting
        this.executeCommand('help');
    }

    initEventListeners() {
        // Focus input when clicking anywhere in terminal
        document.querySelector('.terminal-window').addEventListener('click', () => {
            this.focusInput();
        });

        // Handle input keydown
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.input.value.trim();
                if (command) {
                    this.handleCommand(command);
                }
                this.input.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });

        // Handle navigation clicks
        document.querySelectorAll('.nav-command').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Prevent default label behavior if any
                e.preventDefault();
                const command = btn.getAttribute('data-command');
                if (command) {
                    // Type it out for effect
                    this.typeCommand(command);
                }
            });
        });
    }

    focusInput() {
        this.input.focus();
    }

    typeCommand(command) {
        this.input.value = '';
        let i = 0;
        const speed = 50; // ms per char
        
        const type = () => {
            if (i < command.length) {
                this.input.value += command.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Execute after typing
                setTimeout(() => {
                    this.handleCommand(command);
                    this.input.value = '';
                }, 200);
            }
        };
        
        type();
    }

    handleCommand(cmdString) {
        // Add to history
        this.history.push(cmdString);
        this.historyIndex = this.history.length;

        // Create command line in output
        this.printCommandLine(cmdString);

        // Process command
        const cmd = cmdString.toLowerCase().trim();
        
        if (this.commands[cmd]) {
            this.commands[cmd].action();
        } else if (cmd === '') {
            // Do nothing
        } else {
            this.printOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, 'error');
        }

        // Scroll to bottom
        this.scrollToBottom();
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        }
    }

    printCommandLine(command) {
        const div = document.createElement('div');
        div.className = 'command-line';
        div.innerHTML = `
            <span class="prompt">meshack@portfolio:~$</span>
            <span class="command">${command}</span>
        `;
        this.output.appendChild(div);
    }

    printOutput(content, type = 'text') {
        const div = document.createElement('div');
        div.className = `output-line ${type}`;
        
        if (type === 'html') {
            div.innerHTML = content;
        } else {
            div.textContent = content;
        }
        
        this.output.appendChild(div);
    }

    scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    // Command Actions
    
    showHelp() {
        const helpContent = document.getElementById('help-template').innerHTML;
        this.printOutput(helpContent, 'html');
    }

    showWhoAmI() {
        const content = document.getElementById('whoami-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showEducation() {
        const content = document.getElementById('education-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showProjects() {
        const content = document.getElementById('projects-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showSkills() {
        const content = document.getElementById('skills-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showInterests() {
        const content = document.getElementById('interests-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showContact() {
        const content = document.getElementById('contact-template').innerHTML;
        this.printOutput(content, 'html');
    }

    showHistory() {
        let content = '';
        this.history.forEach((cmd, index) => {
            content += `<div>${index + 1}  ${cmd}</div>`;
        });
        this.printOutput(content, 'html');
    }
}

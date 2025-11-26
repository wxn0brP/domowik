# domowik

A lightweight command-line tool for storing and managing key-value pairs. Domowik is particularly useful for managing environment variables, API keys, and other configuration values that you frequently access or need to copy to your clipboard. The data is stored persistently in `~/.local/domowik.json`.

## Requirements

- Linux
- Bun
- wl-copy (for clipboard functionality)
- Command provided by [ingr](https://github.com/wxn0brP/dotfiles) (wxn0brP/dotfiles)

## Installation

```bash
ingr domowik
```

## Basic Usage

```bash
# Store a key-value pair
domowik set <key> <value>

# Retrieve a value by key
domowik get <key>

# Copy a value to clipboard
domowik copy <key>

# List all stored keys
domowik list

# Export values in dotenv format
domowik export <pattern>

# Export values in shell format
domowik export-sh <pattern>
```

## License

MIT
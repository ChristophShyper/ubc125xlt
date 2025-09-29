# UBC125XLT Scanner Configuration Tool

A modern web application for configuring Uniden UBC125XLT radio scanner frequencies. This tool allows users to easily select frequency groups, customize individual frequency selections, and download scanner configuration files.

## Features

- **Modern, Responsive Interface**: Clean, mobile-friendly design with intuitive controls
- **Frequency Groups**: Pre-organized frequency groups (Police, Fire, EMS, Aviation, Marine, Business, Railroad, Utilities)
- **Group Selection**: Select entire frequency groups with a single click
- **Individual Control**: Deselect specific frequencies within selected groups
- **Easy Configuration**: Frequencies stored in easily maintainable JavaScript file
- **Download Functionality**: Generate and download UBC125XLT compatible configuration files
- **Real-time Summary**: Live count of selected frequencies and active groups

## Quick Start

1. Open `index.html` in a web browser
2. Select desired frequency groups by clicking on the group headers
3. Fine-tune your selection by unchecking individual frequencies if needed
4. Click "Download Configuration" to get your scanner config file

## File Structure

```
├── index.html          # Main application HTML
├── styles.css          # Modern CSS styling
├── app.js             # Main application logic
├── frequencies.js     # Frequency database (easily maintainable)
└── README.md          # This documentation
```

## Adding/Modifying Frequencies

To add or modify frequencies, edit the `frequencies.js` file:

```javascript
"groupName": {
    name: "Display Name",
    icon: "fas fa-icon-name",
    description: "Group description",
    frequencies: [
        { 
            freq: "123.4567", 
            description: "Service Name", 
            toneCode: "CSQ" 
        }
        // Add more frequencies here
    ]
}
```

### Frequency Properties:
- `freq`: Frequency in MHz (as string)
- `description`: Human-readable service name
- `toneCode`: CTCSS tone code or "CSQ" for carrier squelch

## Configuration File Format

The generated configuration file is in CSV format compatible with UBC125XLT programming software:

```
Channel,Frequency,Description,Group,Tone,Mode
1,155.7550,Police Dispatch 1,Police,CSQ,FM
2,154.2650,Fire Dispatch,Fire Department,CSQ,FM
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Responsive design included

## Customization

### Adding New Groups
1. Add a new group object to `frequencies.js`
2. Use FontAwesome icons for group icons
3. Follow the existing structure for consistency

### Styling Changes
Modify `styles.css` to customize:
- Colors (CSS custom properties in `:root`)
- Layout and spacing
- Responsive breakpoints

## Deployment

### Local Development
Simply open `index.html` in a web browser.

### Web Hosting
Upload all files to any web server. No server-side processing required.

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch/folder

## Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks or build tools required
- **Client-side only**: No server required, works offline
- **ES6+ JavaScript**: Modern JavaScript features
- **CSS Grid/Flexbox**: Modern responsive layout
- **FontAwesome Icons**: CDN-loaded icons

## License

Apache License 2.0 - See LICENSE file for details

## Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues or questions:
1. Check existing documentation
2. Review frequency data in `frequencies.js`
3. Submit an issue on GitHub
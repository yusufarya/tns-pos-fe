'use client'

import React, { useEffect, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TranslateIcon from '@mui/icons-material/Translate'
import Typography from '@mui/material/Typography'

export default function ChangeLanguage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('id')

  const languages = ['id', 'en']

  useEffect(() => {
    // Fetch the 'lang' from localStorage
    const fixLanguage = localStorage.getItem('lang') || 'id'
    setSelectedLanguage(fixLanguage)
  }, [])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (language: string) => {
    setSelectedLanguage(language)
    setAnchorEl(null)
    localStorage.setItem('lang', language)
  }

  return (
    <div>
      <IconButton onClick={handleClick} size='large'>
        <TranslateIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(selectedLanguage)}
        PaperProps={{
          style: {
            borderRadius: 10,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '8px'
          }
        }}
      >
        {languages.map(language => (
          <MenuItem
            key={language}
            onClick={() => handleClose(language)}
            selected={selectedLanguage === language}
            style={{
              borderRadius: 5,
              margin: '4px 0',
              backgroundColor: selectedLanguage === language ? '#eceeff' : 'transparent'
            }}
          >
            <Typography>{language}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

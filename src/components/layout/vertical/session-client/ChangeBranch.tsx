'use client'

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useEffect, useState } from 'react'
import AppService from '@/app/api/services/app-service'
import { BrandResponse } from '@/@core/master-data-types'
import { Skeleton, Typography } from '@mui/material'

export default function ChangeCurrentBranch() {
  const [allBranchData, setAllBranchData] = useState<BrandResponse[]>()
  const [currentBranch, setCurrentBranch] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getDataBranch = async () => {
      try {
        const result = await AppService.serviceGet('api/all-branch')
        if (result.statusCode === 200) {
          setAllBranchData(result.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    getDataBranch()

    const storedBranch = localStorage.getItem('current_branch') || '1'
    setCurrentBranch(storedBranch)

    // Ensure 'current_branch' is saved back to localStorage
    localStorage.setItem('current_branch', storedBranch)
  }, [])

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentBranch(event.target.value)
    localStorage.setItem('current_branch', event.target.value)
  }

  return (
    <>
      {allBranchData ? (
        <div>
          <Select
            sx={{ fontSize: '13px' }}
            size='small'
            labelId='demo-select-small-label'
            id='demo-select-small'
            value={currentBranch}
            onChange={handleChange}
          >
            {allBranchData.map(item => (
              <MenuItem key={item.id} value={item.id.toString()}>
                {item.name} &nbsp;
              </MenuItem>
            ))}
          </Select>
        </div>
      ) : (
        <Skeleton className='w-44 h-14' />
      )}
    </>
  )
}

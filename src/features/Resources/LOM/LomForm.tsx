import React from 'react'
import { Grid } from 'semantic-ui-react'
import Lom from './Lom'

export function LomForm({data, standard, limitedUse=false }) {
  return (
    <Grid style={{backgroundColor: '#fff'}}>
      {limitedUse &&
        <h1 style={{padding: '0.5em', marginTop: '1em', textAlign: 'center', backgroundColor: '#fff', width: 'calc(100% - 2rem)'}}>
              Limited use (LOM only)
        </h1>
      }
      <Grid item={true} sm={12} style={{width: '100%', ...(limitedUse && {marginBottom: '1em'} )}}>
        <Lom resourceData={data} standard={standard}/>
      </Grid>
    </Grid>
  )
}

export default LomForm

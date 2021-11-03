import React from 'react'
import { Grid } from 'semantic-ui-react'
import Lom from './Lom'

function LomForm({data, standard}) {
  return (
    <Grid container>
      <Grid item sm={12} style={{width: '100%'}}>
        <Lom resourceData={data} standard={standard}/>
      </Grid>
    </Grid>
  )
}

export default LomForm
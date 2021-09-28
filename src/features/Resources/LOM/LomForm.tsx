import React from 'react'
import { Grid } from 'semantic-ui-react'
import Lom from './Lom'

function LomForm({data, standard}) {
  return (
    <Grid container>
      <Grid item sm={12}>
        <Lom resourceData={data} standard={standard}/>
      </Grid>
    </Grid>
  )
}

export default LomForm
import React from "react";
import PropTypes from "prop-types";
import PageBase from "../PageBase";
import {Box, Grid} from "@material-ui/core";
import {InfoBloc} from "../InfoBloc";
import {useTranslation} from "react-i18next";

export default function InfoGrid({ title, navigation, headers, values }) {
  const { t } = useTranslation();

  return (
    <PageBase title={title} navigation={navigation} backButton>
      <Box marginY={4}>
        <Grid container spacing={2}>
          {headers?.map(header => (
            <Grid item key={header.id} xs={12} sm={6} md={3}>
              <InfoBloc label={typeof header.label === 'string' ? t(header.label) : t(header.label.props.id)} value={values?.[header.id]} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageBase>
  );
}

InfoGrid.propTypes = {
  title: PropTypes.string.isRequired,
  navigation: PropTypes.string,
  headers: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};

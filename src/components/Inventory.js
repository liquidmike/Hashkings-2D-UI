import React from "react";
import {gardenNames, seedNames} from "../service/HashkingsAPI";
import _ from "lodash";

export default function Inventory({user}) {
  return (
    <div className="p-grid">
      <div className="card p-col-3 card-margin">
        <h3>
          <u>Active Gardens</u>
          {_.uniqBy(user.activeGardens, garden => garden.id[0])
            .map(garden => ({
              id: garden.id[0],
              count: user.activeGardens.filter(
                agarden => agarden.id[0] === garden.id[0]
              ).length
            }))
            .map(garden => (
              <p key={garden.id}>
                {garden.count} {gardenNames[garden.id]} Plot
                {garden.count !== 1 ? "s" : ""}
              </p>
            ))}
        </h3>
      </div>
      <div className="card p-col-3 card-margin">
        <h3>
          <u>Available Gardens</u>
          {_.uniqBy(user.availableGardens, garden => garden[0])
            .map(garden => ({
              id: garden[0],
              count: user.availableGardens.filter(
                agarden => agarden[0] === garden[0]
              ).length
            }))
            .map(garden => (
              <p key={garden.id}>
                {garden.count} {gardenNames[garden.id]} Plot
                {garden.count !== 1 ? "s" : ""}
              </p>
            ))}
        </h3>
      </div>
      <div className="card p-col-3 card-margin">
        <h3>
          <u>Available Seeds</u>
          {_.uniqBy(user.availableSeeds, seed => seed.strain)
            .map(seed => ({
              strain: seed.strain,
              count: user.availableSeeds.filter(
                aseed => aseed.strain === seed.strain
              ).length
            }))
            .map(seed => (
              <p key={seed.strain}>
                {seed.count} {seedNames[seed.strain]} Seed
                {seed.count !== 1 ? "s" : ""}
              </p>
            ))}
        </h3>
      </div>
    </div>
  );
}

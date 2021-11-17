import React from "react";

export const VersionInfo = () => {
  const MajorEdit = 1;
  const MinorEdit = 1;
  const PatchRelease = 0;
  const version = MajorEdit+"."+MinorEdit+"."+PatchRelease
  return (
    <div className="version-info">ePaws-v.{version}</div>
  );
};
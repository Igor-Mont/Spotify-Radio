import { jest, expect, describe, test, beforeEach } from '@jest/globals'
import fs from 'fs';
import fsPromises from 'fs/promises';
import config from '../../../server/config.js';
import { Service } from '../../../server/service.js';
import TestUtil from '../_util/testUtil.js';

const { dir: { publicDirectory } } = config

describe("#Service - test suite for service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('#createFileStream', async () => {
    const file = '/index.html';
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    const createReadStream = jest
      .spyOn(fs, fs.createReadStream.name)
      .mockResolvedValue(mockFileStream);
    
      const service = new Service();

      const serviceReturn = service.createFileStream(file);

      expect(createReadStream).toBeCalledWith(file);
      expect(serviceReturn).resolves.toStrictEqual(mockFileStream);
  });

  test('#getFileInfo', async () => {
    const currentSong = 'mySong.mp3';

    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue();

    const service = new Service();

    const result = await service.getFileInfo(currentSong);
    const expectedResult = {
      type: '.mp3',
      name: `${publicDirectory}/${currentSong}`
    };

    expect(result).toStrictEqual(expectedResult);
  });

  test('#getFileStream', async () => {
    const currentSong = `mySong.mp3`;
    const currentReadable = TestUtil.generateReadableStream(['abc']);
    const currentSongFullPath = `${publicDirectory}/${currentSong}`;

    const fileInfo = {
      type: '.mp3',
      name: currentSongFullPath
    }

    const service = new Service()

    jest.spyOn(
        service,
        service.getFileInfo.name)
        .mockResolvedValue(fileInfo);

    jest.spyOn(
        service,
        service.createFileStream.name)
        .mockReturnValue(currentReadable);

    const result = await service.getFileStream(currentSong);

    const expectedResult = {
      type: fileInfo.type,
      stream: currentReadable
    }
    expect(result).toStrictEqual(expectedResult);
    
    expect(service.createFileStream).toHaveBeenCalledWith(
      fileInfo.name
    );

    expect(service.getFileInfo).toHaveBeenCalledWith(
      currentSong
    )
  })

});
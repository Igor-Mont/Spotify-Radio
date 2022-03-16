import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller';
import { Service } from '../../../server/service';
import TestUtil from '../_util/testUtil';

const { pages } = config;

describe('#Controller - test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should be able return a fileStream", async () => {
    const controller = new Controller();
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    const getFileStream = jest
      .spyOn(
        Service.prototype,
        Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream
      });

    await controller.getFileStream(pages.homeHTML);

    expect(getFileStream).toBeCalledWith(pages.homeHTML);
  });
});
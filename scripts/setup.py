from distutils.core import setup

setup(
    name='LBExporters',
    version='0.1dev',
    packages=['labelbox2coco', 'labelbox2pascal'],
    licence='Apache 2.0',
    long_description=open('README.md').read(),
)

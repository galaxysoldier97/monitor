TECREP MONITOR DEPLOY

https://confluence.itsf.io/display/ION/Ops%2C+Administration+-+Tecrep+monitor



TIGO PANAMÁ
- podman login git.tigopa.local:5050 
    - iniciar con usuario y contraseña gitlab
- podman tag monitor-tecrep-monitor-local git.tigopa.local:5050/tigo/tecrep/monitor:toc   (o docker)
- podman push git.tigopa.local:5050/tigo/tecrep/monitor:toc (o docker)
- git push o merge sobre la rama toc-sat-dev
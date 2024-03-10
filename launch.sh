#!/bin/bash

# Launch the server project in the background
(cd server && dotnet watch run) &

# Launch the client project in the background
(cd client && npm run dev) &

# Wait for all background processes to finish
wait
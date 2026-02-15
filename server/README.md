Routes -
    /upsert
        /post - create embedding for the post and update/insert into pinecone server
        /user - create embedding for the user and update/insert into piencone server
    
    /search?query
        - search posts
        - search users with #username
        - search posts of a tag with #tags
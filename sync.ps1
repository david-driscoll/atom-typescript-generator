node .\index.js
Copy-Item generated\* ..\..\omnisharp\omnisharp-atom\typingsTemp -recurse -force
Copy-Item generated\* ..\..\omnisharp\atom-yeoman\typingsTemp -recurse -force

gci ..\..\omnisharp\omnisharp-atom\typingsTemp -recurse -file | foreach {
    $content = get-content $_.FullName;
    $content = $content.Replace("../semver/semver.d.ts", "../../typings/semver/semver.d.ts").Replace("../q/q.d.ts", "../../typings/q/Q.d.ts").Replace("../jquery/jquery.d.ts", "../../typings/jquery/jquery.d.ts")
    set-content $_.FullName $content
}

gci ..\..\omnisharp\atom-yeoman\typingsTemp -recurse -file | foreach {
    $content = get-content $_.FullName;
    $content = $content.Replace("../semver/semver.d.ts", "../../typings/semver/semver.d.ts").Replace("../q/q.d.ts", "../../typings/q/Q.d.ts").Replace("../jquery/jquery.d.ts", "../../typings/jquery/jquery.d.ts")
    set-content $_.FullName $content
}

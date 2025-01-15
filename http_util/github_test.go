package http_util

import "testing"

func TestGetGithubLatestVersion(t *testing.T) {
	tests := []struct {
		name    string
		want    string
		wantErr bool
	}{
		{
			name:    "github version test",
			want:    "v0.0.2",
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetGithubLatestVersion()
			if (err != nil) != tt.wantErr {
				t.Errorf("GetGithubLatestVersion() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetGithubLatestVersion() got = %v, want %v", got, tt.want)
			}
		})
	}
}
